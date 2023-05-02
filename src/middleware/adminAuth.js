/* eslint-disable no-underscore-dangle */
const { default: mongoose } = require("mongoose");
const AdminModel = require("../model/adminModel");
const { checkTokenValidity } = require("../utils/common");

module.exports = async (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token) {
    return res.unAuthorizedRequest({ message: "Token Not Found...." });
  }

  checkTokenValidity(token)
    .then(async (result) => {
      const userData = await AdminModel.findOne({
        _id: mongoose.Types.ObjectId(result.userId),
      });

      if (userData) {
        req.token = token;
        req.userId = result.userId;
        req.user = userData;
        next();
      } else {
        return res.unAuthorizedRequest({
          message: "Only Admin Access This API..!",
        });
      }
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: webAuth.js ~ line 31 ~ module.exports= ~ err",
        err
      );
      res.unAuthorizedRequest({ message: err });
    });

  return {};
};
