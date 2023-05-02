/**
 * nftValidation.js
 * @description :: validate each post and put request as per Nft model
 */
const joi = require("joi");
const { convertObjectToEnum } = require("../common");
const { NFT_VIDEO_SEARCH_TYPE } = require("../constant");

exports.validNftCreateOrUpdateDetails = joi
  .object({
    name: joi.string().trim().required(),
    number: joi.number().min(0).required(),
    description: joi.string().trim().required(),
    price: joi.number().min(0).required(),
    video: joi
      .alternatives()
      .conditional(
        joi
          .string()
          .trim()
          .pattern(
            /^data:([A-Za-z-+\/]+);base64,(.+)$/,
            "Invalid Video Base64"
          ),
        {
          then: joi
            .string()
            .trim()
            .pattern(
              /^data:([A-Za-z-+\/]+);base64,(.+)$/,
              "Invalid Video Base64"
            )
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
          .pattern(
            /^data:([A-Za-z-+\/]+);base64,(.+)$/,
            "Invalid Photo Base64"
          ),
        {
          then: joi
            .string()
            .trim()
            .pattern(
              /^data:([A-Za-z-+\/]+);base64,(.+)$/,
              "Invalid Photo Base64"
            )
            .required(),
          otherwise: joi.string().trim().uri().required(),
        }
      )
      .required(),
    sold: joi.boolean().required(),
    floorPrice: joi.number().min(0).required(),
    collectionName: joi.string().trim().required(),
    collectionIcon: joi.string().trim().required(),
    contractAddress: joi.string().trim().required(),
    featured: joi.boolean().required(),
  })
  .unknown(true);

exports.validNftPaymentIntentCreate = joi
  .object({
    paymentMethod: joi.string().trim().required(),
    userId: joi.string().trim().required(),
  })
  .unknown(true);

exports.validNftListGet = joi
  .object({
    searchType: joi
      .string()
      .trim()
      .valid(...convertObjectToEnum(NFT_VIDEO_SEARCH_TYPE))
      .required(),
    page: joi.number().min(1).required(),
    limit: joi.number().min(0).required(),
  })
  .unknown(true);

exports.validNftPurchaseListGet = joi
  .object({
    page: joi.number().min(1).required(),
    limit: joi.number().min(0).required(),
  })
  .unknown(true);
