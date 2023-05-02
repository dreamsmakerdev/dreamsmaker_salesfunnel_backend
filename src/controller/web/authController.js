/**
 * authController.js
 * @description :: exports authentication methods
 */

const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/common");
const UsersModel = require("../../model/usersModel");
const AuthTokensModel = require("../../model/authTokensModel");
const authValidation = require("../../utils/validation/authValidation");
const validation = require("../../utils/validateRequest");

exports.signUpUser = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      authValidation.validSingUpUserDetails
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }

    const { email, password, username, firstName, lastName } =
      validateRequest.value;

    let isValidUserName = await UsersModel.findOne({ username });

    if (isValidUserName) {
      return res.badRequest({
        message: "Username already exist",
      });
    }

    isValidUserName = await UsersModel.findOne({ email });
    if (isValidUserName) {
      return res.badRequest({
        message: "Email already exists",
      });
    }

    const newPass = await bcrypt.hash(password, 8);
    const createUser = new UsersModel({
      email,
      password: newPass,
      username,
      firstName,
      lastName,
    });
    await createUser.save();
    return res.ok({
      message: "SuccessFully SignUp User..",
      data: createUser,
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.checkUserNameAvailable = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      authValidation.validUsernameCheck
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }

    const { username } = validateRequest.value;

    let isValidUserName = await UsersModel.findOne({ username });

    if (isValidUserName) {
      return res.ok({
        data: { usernameAvailable: false, username },
        message: "Username already exist",
      });
    }

    return res.ok({
      data: { usernameAvailable: true, username },
      message: "Username Not exist",
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.loginUser = async (req, res) => {
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

    let isValidUserName = await UsersModel.findOne({ email });

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
        message: "Successfully logged in User",
      });
    }
    return res.badRequest({
      message: "UserName & Password Not Matched Please Re Enter..!",
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.logoutUser = async (req, res) => {
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
