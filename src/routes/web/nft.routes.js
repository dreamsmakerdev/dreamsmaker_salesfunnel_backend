/**
 * video.routes.js
 * @description :: routes of video APIs
 */

const express = require("express");
const adminAuth = require("../../middleware/adminAuth");
const webAuth = require("../../middleware/webAuth");

const routes = express.Router();
const {
  deleteNft,
  updateNft,
  createNft,
  getNftList,
  getNftPurchaseList,
} = require("../../controller/web/nftController");

/**
 * @swagger
 * /web/nft:
 *  get:
 *   summary: This API is for nft List Get
 *   description: This API is for nft List Get
 *   tags:
 *    - User NFT
 *   parameters:
 *      - in: query
 *        name: page
 *        schema:
 *           type: number
 *        required: true
 *        description: page
 *        example: 1
 *      - in: query
 *        name: limit
 *        schema:
 *           type: number
 *        required: true
 *        description: limit
 *        example: 1
 *      - in: query
 *        name: searchType
 *        schema:
 *           type: string
 *        required: true
 *        description: searchType
 *        example: ALL/FEATURED
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.get("/", getNftList);

/**
 * @swagger
 * /web/nft/userPurchaseList:
 *  get:
 *   summary: This API is for nft Purchase List Get
 *   description: This API is for nft Purchase List Get
 *   tags:
 *    - User NFT
 *   parameters:
 *      - in: query
 *        name: page
 *        schema:
 *           type: number
 *        required: true
 *        description: page
 *        example: 1
 *      - in: query
 *        name: limit
 *        schema:
 *           type: number
 *        required: true
 *        description: limit
 *        example: 1
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.get("/userPurchaseList", webAuth, getNftPurchaseList);

/**
 * @swagger
 * /web/nft:
 *  post:
 *   summary: This API is for Nft create
 *   description: This API is for Nft create
 *   tags:
 *    - User NFT
 *   requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *                  $ref: '#/definitions/nftData'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/", adminAuth, createNft);

/**
 * @swagger
 * /web/nft/{id}:
 *  put:
 *   summary: This API is for video update
 *   description: This API is for video update
 *   tags:
 *    - User NFT
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        require: true
 *        description: nftId
 *        example: ""
 *   requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *                  $ref: '#/definitions/nftData'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.put("/:id", adminAuth, updateNft);

/**
 * @swagger
 * /web/nft/{id}:
 *  delete:
 *   summary: This API is for nft delete
 *   description: This API is for nft delete
 *   tags:
 *    - User NFT
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        require: true
 *        description: nftId
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.delete("/:id", adminAuth, deleteNft);

/**
 * @swagger
 * definitions:
 *   nftData:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: name
 *        number:
 *         type: number
 *         description: number
 *        description:
 *         type: string
 *         description: description
 *        price:
 *         type: number
 *         description: price
 *        sold:
 *         type: boolean
 *         description: sold
 *        floorPrice:
 *         type: number
 *         description: floorPrice
 *        video:
 *         type: string
 *         description: video
 *        photo:
 *         type: string
 *         description: photo
 *        collectionName:
 *         type: string
 *         description: name
 *        collectionIcon:
 *         type: string
 *         description: icon
 *        contractAddress:
 *         type: string
 *         description: contractAddress
 *        featured:
 *         type: boolean
 *         description: false
 */

/**
 * @swagger
 * definitions:
 *   paymentIntent:
 *       type: object
 *       properties:
 *        userId:
 *         type: string
 *         description: userId
 *        paymentMethod:
 *         type: string
 *         description: paymentMethod
 */

module.exports = routes;
