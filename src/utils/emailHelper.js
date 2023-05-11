const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.sendSuccessfulPurchaseMail = (to) => {
    let mailDetails = {
        from: process.env.SMTP_USERNAME,
        to: to,
        subject: "Your order has been successfully processed",
        text: "Your order purchase for one of our NFT is successful. Now you can go to our website and see your NFT in the My NFT dashboard.\nThank you for your support in the last text.",
    };

    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

