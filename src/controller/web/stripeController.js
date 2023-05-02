const UserModel = require("../../model/usersModel");
const { v4: uuidv4 } = require("uuid");

const validStripValidation = require("../../utils/validation/stripValidation");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY.toString());
const validation = require("../../utils/validateRequest");
const PaymentMethodModel = require("../../model/paymentMethodModel");
const BillingAddressModel = require("../../model/billingAddressModel");
const NftModel = require("../../model/nftModel");
const PaymentSessionModel = require("../../model/paymentSessionModel");
const { usdCurrentPriceGet } = require("../../../apiCall");
const { PAYMENT_STATUS } = require("../../utils/constant");

exports.registerUser = async (req, res) => {
    try {
        const validateRequest = validation.validateParamsWithJoi(
            req.body,
            validStripValidation.validStripUserRegisterData
        );

        if (!validateRequest.isValid) {
            return res.badRequest({
                message: `Invalid Params : ${validateRequest.message}`,
            });
        }
        const { phone } = validateRequest.value;
        const { email, name, password } = req.user;

        const customer = await createStripeCustomer({
            email,
            name,
            password,
            phone,
        });
        await UserModel.findByIdAndUpdate(
            { _id: req.userId },
            {
                $set: {
                    customerId: customer.id,
                    phone,
                },
            }
        );
        return res.ok({ message: "Customer created", data: customer });
    } catch (err) {
        return res.badRequest({ message: err.message });
    }
};

exports.paymentMethodAttach = async (req, res) => {
    try {
        const validateRequest = validation.validateParamsWithJoi(
            req.body,
            validStripValidation.validStripPaymentMethodData
        );

        if (!validateRequest.isValid) {
            return res.badRequest({
                message: `Invalid Params : ${validateRequest.message}`,
            });
        }

        const { customerId } = req.user;
        if (!customerId) {
            return res.badRequest({ message: "CustomerId Not Found" });
        }

        const { cardNumber, expMonth, expYear, name, address } = validateRequest.value;

        const card = {
            number: cardNumber,
            exp_month: parseInt(expMonth),
            exp_year: parseInt(expYear),
        };

        const billingDetails = {
            name: name,
            address: {
                country: address.country,
                state: address.state,
                city: address.city,
                line1: address.line1,
                postal_code: address.postal_code,
            },
            email: req.user.email,
            phone: req.user.phone,
        };

        const getPaymentData = await attachMethod({
            card,
            billingDetails,
            customerId,
        });

        await PaymentMethodModel.findOneAndUpdate(
            {
                userId: req.userId,
            },
            {
                $push: {
                    paymentMethodId: getPaymentData.id,
                },
                $set: {
                    userId: req.userId,
                },
            },
            { upsert: true }
        );

        const saveBillingAddress = new BillingAddressModel({
            ...billingDetails,
            userId: req.userId,
        });
        await saveBillingAddress.save();

        return res.ok({ message: "Payment method attached successfully" });
    } catch (err) {
        return res.badRequest({ message: err.message });
    }
};

exports.paymentMethodListGet = async (req, res) => {
    try {
        const paymentMethods = await listCustomerPayMethods(
            req.query.paymentMethodId,
            req.user.customerId
        );
        return res.ok({
            message: "successFully Payment Method Get",
            data: paymentMethods,
        });
    } catch (err) {
        return res.failureResponse({ message: err.message });
    }
};

exports.paymentInvoiceGet = async (req, res) => {
    try {
        if (req.query.paymentId) {
            const paymentMethods = await stripe.checkout.sessions.retrieve(req.query.paymentId);
            return res.ok({
                message: "SuccessFully Payment Invoice Get",
                data: paymentMethods,
            });
        }
        const paymentMethods = await stripe.checkout.sessions.list({
            limit: 100,
        });
        return res.ok({
            message: "SuccessFully Payment Invoice Get",
            data: paymentMethods,
        });
    } catch (err) {
        return res.failureResponse({ message: err.message });
    }
};

exports.createCheckoutSession = async (req, res) => {
    try {
        const validateRequest = validation.validateParamsWithJoi(
            req.body,
            validStripValidation.validStripPaymentSessionCreate
        );

        if (!validateRequest.isValid) {
            return res.badRequest({
                message: `Invalid Params : ${validateRequest.message}`,
            });
        }

        const { success_url, cancel_url, quantity, nftId } = validateRequest.value;

        const checkRequest = await PaymentSessionModel.aggregate([
            {
                $match: {
                    status: PAYMENT_STATUS.PENDING,
                },
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: {
                        $sum: "$quantity",
                    },
                },
            },
        ]);

        if (checkRequest[0]?.totalQuantity > quantity) {
            return res.badRequest({
                message: "Currently Active Requests have sold out The stock, try again later",
            });
        }

        const getNftData = await NftModel.findOne({ _id: nftId });
        if (!getNftData) {
            return res.badRequest({ message: "Invalid NftId Data Not Found" });
        }
        if (getNftData.sold) {
            return res.badRequest({ message: "This Nft Is Already Sold" });
        }
        if (getNftData.remainingUnit < quantity) {
            return res.badRequest({ message: "Not enough Quantity is available to buy " });
        }

        const uniqueCode = uuidv4();
        const response = await usdCurrentPriceGet();

        const URL = process.env.PAYMENT_STATUS_BASE_URL_PATH;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            images: [getNftData.photo],
                            name: getNftData.name,
                        },
                        unit_amount: Math.floor(getNftData.price * response * 100),
                    },
                    quantity,
                },
            ],
            mode: "payment",
            success_url: `${URL}/web/strip/payment/success?uniqueCode=${uniqueCode}`,
            cancel_url: `${URL}/web/strip/payment/failed?uniqueCode=${uniqueCode}`,
        });

        const createSessionData = new PaymentSessionModel({
            sessionId: session.id,
            nftId,
            userId: req.userId,
            uniqueCode,
            usdPrice: response,
            nftPrice: getNftData.price,
            quantity,
            successURL: success_url,
            failedURL: cancel_url,
        });
        await createSessionData.save();
        return res.ok({ message: "Payment Session Created...!", data: session });
    } catch (error) {
        return res.failureResponse({ message: error.message });
    }
};

exports.paymentSuccess = async (req, res) => {
    try {
        const getSessionData = await PaymentSessionModel.findOneAndUpdate(
            {
                uniqueCode: req.query.uniqueCode,
            },
            { $set: { status: PAYMENT_STATUS.SUCCESS } }
        );

        const quantity = 0 - getSessionData.quantity;

        await NftModel.findByIdAndUpdate(
            { _id: getSessionData.nftId },
            {
                $inc: { remainingUnit: quantity },
            }
        );
        await NftModel.updateOne(
            { $and: [{ _id: getSessionData.nftId }, { remainingUnit: 0 }] },
            {
                $set: { sold: true },
            }
        );
        return res.redirect(getSessionData.successURL);
    } catch (error) {
        return res.failureResponse({ message: error.message });
    }
};

exports.paymentFailed = async (req, res) => {
    try {
        const getSessionData = await PaymentSessionModel.findOneAndUpdate(
            {
                uniqueCode: req.query.uniqueCode,
            },
            { $set: { status: PAYMENT_STATUS.FAILED } }
        );
        return res.redirect(getSessionData.failedURL);
    } catch (error) {
        return res.failureResponse({ message: error.message });
    }
};

/* Helper Functions  ----------------------------------------------------------------------------------------------------- */

async function createStripeCustomer({ name, email, phone }) {
    return new Promise(async (resolve, reject) => {
        try {
            const Customer = await stripe.customers.create({
                name: name,
                email: email,
                phone: phone,
            });

            resolve(Customer);
        } catch (err) {
            reject(err);
        }
    });
}

async function listCustomerPayMethods(paymentMethodId, customer) {
    return new Promise(async (resolve, reject) => {
        try {
            if (paymentMethodId) {
                const paymentMethods = await stripe.paymentMethods.retrieve(paymentMethodId);
                return resolve(paymentMethods);
            }
            const paymentMethods = await stripe.paymentMethods.list({
                customer,
                type: "card",
            });
            return resolve(paymentMethods);
        } catch (err) {
            reject(err);
        }
    });
}

function attachMethod({ card, billingDetails, customerId }) {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: "card",
                billing_details: billingDetails,
                card,
            });
            const paymentMethodAttach = await stripe.paymentMethods.attach(paymentMethod.id, {
                customer: customerId,
            });
            resolve(paymentMethodAttach);
        } catch (err) {
            reject(err);
        }
    });
}

exports.checkSession = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    await PaymentSessionModel.updateMany(
        { createdAt: { $lt: fiveMinutesAgo }, status: PAYMENT_STATUS.PENDING },
        { $set: { status: PAYMENT_STATUS.FAILED } }
    );
};

