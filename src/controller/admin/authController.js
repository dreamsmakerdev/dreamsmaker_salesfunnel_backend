/**
 * authController.js
 * @description :: exports authentication methods
 */

const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/common");
const AdminModel = require("../../model/adminModel");
const AuthTokensModel = require("../../model/authTokensModel");
const authValidation = require("../../utils/validation/authValidation");
const validation = require("../../utils/validateRequest");

exports.loginAdmin = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      authValidation.validLoginDetails
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }

    const { email, password } = validateRequest.value;

    let isValidUserName = await AdminModel.findOne({ email });

    if (!isValidUserName) {
      return res.badRequest({
        message: "Invalid Please Enter Valid email & Password..!",
      });
    }

    const newPass = await bcrypt.compare(password, isValidUserName.password);
    if (newPass) {
      const userId = isValidUserName._id;

      const { token, refreshToken } = await generateToken(userId);

      isValidUserName = {
        name: isValidUserName.name,
        email: isValidUserName.email,
      };
      return res.ok({
        data: { isValidUserName, refreshToken, token },
        message: "Successfully logged in Admin",
      });
    }
    return res.badRequest({
      message: "Email & Password Not Matched Please Re Enter..!",
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    const { token } = req;
    const userId = req.user?._id;

    if (token && userId) {
      await AuthTokensModel.updateOne(
        { token: req.token, userId },
        { $set: { isActive: false } }
      );
      return res.ok({ message: "Logout successfully" });
    }
    return res.insufficientParameters();
  } catch (error) {
    return res.failureResponse();
  }
};
