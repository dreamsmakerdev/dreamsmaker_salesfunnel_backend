/**
 * stripValidation.js
 * @description :: validate each post and put request as per user model
 */
const joi = require("joi");

exports.validStripUserRegisterData = joi
  .object({
    phone: joi.string().trim().required(),
  })
  .unknown(true);

exports.validStripPaymentSessionCreate = joi
  .object({
    success_url: joi.string().trim().uri().required(),
    cancel_url: joi.string().trim().uri().required(),
    quantity: joi.number().min(1).required(),
    nftId: joi
      .string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Formate ")
      .required(),
  })
  .unknown(true);

exports.validStripPaymentMethodData = joi
  .object({
    name: joi.string().trim().required(),
    cardNumber: joi.string().trim().required(),
    expMonth: joi.number().required(),
    expYear: joi.number().required(),
    address: joi
      .object({
        country: joi
          .string()
          .trim()
          .uppercase()
          .valid("US", "EG", "GB")
          .required(),
        state: joi.string().trim().required(),
        city: joi.string().trim().required(),
        line1: joi.string().trim().required(),
        postal_code: joi.number().required(),
      })
      .required(),
  })
  .unknown(true);
