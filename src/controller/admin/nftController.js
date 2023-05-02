const nftValidation = require("../../utils/validation/nftValidation");
const validation = require("../../utils/validateRequest");
const { getLimitAndSkipSize } = require("../../utils/common");
const PaymentSessionModel = require("../../model/paymentSessionModel");

exports.getNftPurchaseList = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.query,
      nftValidation.validNftPurchaseListGet
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params ${validateRequest.message}`,
      });
    }
    let [, limit, skip] = getLimitAndSkipSize(
      validateRequest.value.page,
      validateRequest.value.limit
    );

    const totalDocument = await PaymentSessionModel.find().count();

    const getPurchaseList = await PaymentSessionModel.aggregate([
      {
        $lookup: {
          from: "nft",
          localField: "nftId",
          foreignField: "_id",
          as: "nftData",
        },
      },
      {
        $unwind: {
          path: "$nftData",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    if (getPurchaseList.length === 0) {
      return res.noContent();
    }
    return res.ok({
      message: "SuccessFully All Nft Purchase List..",
      data: { list: getPurchaseList, total: totalDocument },
    });
  } catch (error) {
    return res.failureResponse();
  }
};
