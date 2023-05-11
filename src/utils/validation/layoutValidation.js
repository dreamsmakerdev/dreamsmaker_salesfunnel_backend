/**
 * nftValidation.js
 * @description :: validate each post and put request as per Nft model
 */
const joi = require("joi");

const base64Check = (error) =>
    joi
        .string()
        .trim()
        .pattern(/^data:([A-Za-z-+\/]+);base64,(.+)$/, `${error}`);

const videoValidation = joi
    .alternatives()
    .conditional(base64Check("Invalid Video Base64"), {
        then: base64Check("Invalid Video Base64"),
        otherwise: joi.string().trim().uri().required(),
    })
    .required();

const imageValidation = joi
    .alternatives()
    .conditional(base64Check("Invalid Image Base64"), {
        then: base64Check("Invalid Image Base64"),
        otherwise: joi.string().trim().uri().required(),
    })
    .required();

exports.layoutUpdateValidation = joi
    .object({
        landing: joi
            .object({
                title: joi.string().trim().required(),
                backgroundVideo: videoValidation,
            })
            .unknown(true),
        mintChecker: joi
            .object({
                cardTitle: joi.string().trim().required(),
                heading: joi.string().trim().required(),
                description: joi.string().trim().required(),
                image: imageValidation,
            })
            .unknown(true),
        discord: joi
            .object({
                description: joi.string().trim().required(),
                discordUrl: joi.string().trim().required(),
                video: videoValidation,
                firstWinner: joi.object({
                    name: joi.string().trim().required(),
                    logo: imageValidation,
                }),
                secondWinner: joi.object({
                    name: joi.string().trim().required(),
                    logo: imageValidation,
                }),
                thirdWinner: joi.object({
                    name: joi.string().trim().required(),
                    logo: imageValidation,
                }),
            })
            .unknown(true),
        partners: joi
            .object({
                description: joi.string().trim().required(),
                list: joi.array().items(
                    joi
                        .object({
                            logo: joi.string().trim().required(),
                            link: joi.string().trim().allow(""),
                        })
                        .unknown(true)
                ),
            })
            .unknown(true),
        links: joi.array().items(
            joi
                .object({
                    name: joi.string().trim().required(),
                    link: joi.string().trim().allow(""),
                })
                .unknown(true)
        ),
    })
    .unknown(true);

