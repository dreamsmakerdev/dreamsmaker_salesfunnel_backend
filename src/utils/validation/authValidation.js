/**
 * userValidation.js
 * @description :: validate each post and put request as per user model
 */
const joi = require("joi");

/** validation keys and properties of user */
exports.validLoginDetails = joi
  .object({
    email: joi.string().trim().lowercase().email().required(),
    password: joi.string().trim().required(),
  })
  .unknown(true);

/** validation keys and properties of user */
exports.validAdminLoginDetails = joi
  .object({
    email: joi.string().trim().lowercase().email().required(),
    password: joi.string().min(1).required(),
  })
  .unknown(true);

exports.validSingUpUserDetails = joi
  .object({
    email: joi.string().trim().lowercase().email().required(),
    password: joi.string().required(),
    firstName: joi.string().trim().lowercase().required(),
    lastName: joi.string().trim().lowercase().required(),
    username: joi.string().trim().required(),
  })
  .unknown(true);

exports.validUsernameCheck = joi
  .object({
    username: joi.string().trim().required(),
  })
  .unknown(true);
