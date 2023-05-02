/**
 * video.routes.js
 * @description :: routes of video APIs
 */

const express = require("express");
const adminAuth = require("../../middleware/adminAuth");

const routes = express.Router();
const { getNftPurchaseList } = require("../../controller/admin/nftController");

/**
 * @swagger
 * /admin/nft/purchaseList:
 *  get:
 *   summary: This API is for nft Purchase List Get
 *   description: This API is for nft Purchase List Get
 *   tags:
 *    - Admin NFT
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
routes.get("/purchaseList", adminAuth, getNftPurchaseList);

module.exports = routes;
