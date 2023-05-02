/**
 * videoValidation.js
 * @description :: validate each post and put request as per user model
 */
const joi = require("joi");
const { convertObjectToEnum } = require("../common");
const { NFT_VIDEO_SEARCH_TYPE } = require("../constant");

exports.validVideoCreateOrUpdateDetails = joi
  .object({
    title: joi.string().trim().required(),
    video: joi
      .alternatives()
      .conditional(
        joi
          .string()
          .trim()
          .pattern(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        {
          then: joi
            .string()
            .trim()
            .pattern(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            .required(),
          otherwise: joi.string().trim().uri().required(),
        }
      )
      .required(),
    photo: joi
      .alternatives()
      .conditional(
        joi
          .string()
          .trim()
          .pattern(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        {
          then: joi
            .string()
            .trim()
            .pattern(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            .required(),
          otherwise: joi.string().trim().uri().required(),
        }
      )
      .required(),
    featured: joi.boolean().required(),
  })
  .unknown(true);

exports.validVideoListGet = joi
  .object({
    page: joi.number().min(1).required(),
    limit: joi.number().min(0).required(),
    searchType: joi
      .string()
      .trim()
      .valid(...convertObjectToEnum(NFT_VIDEO_SEARCH_TYPE))
      .required(),
  })
  .unknown(true);
