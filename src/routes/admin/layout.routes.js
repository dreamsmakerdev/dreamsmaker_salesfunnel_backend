/**
 * video.routes.js
 * @description :: routes of video APIs
 */

const express = require("express");
const { updateSiteLayout } = require("../../controller/admin/layoutController");
const adminAuth = require("../../middleware/adminAuth");

const routes = express.Router();

/**
 * @swagger
 * /admin/layout:
 *  put:
 *   summary: This API is for site layout update
 *   description: This API is for site layout update
 *   tags:
 *    - Site Layout
 *   requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *                  $ref: '#/definitions/siteData'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.put("/", adminAuth, updateSiteLayout);

/**
 * @swagger
 * definitions:
 *   siteData:
 *       type: object
 *       properties:
 *        landing:
 *         type: object
 *         properties:
 *          title:
 *           type: string
 *          backgroundVideo:
 *           type: string
 *        mintChecker:
 *         type: object
 *         properties:
 *          title:
 *           type: string
 *          backgroundVideo:
 *           type: string
 *          heading:
 *           type: string
 *          description:
 *           type: string
 *        discord:
 *         type: object
 *         properties:
 *          discordUrl:
 *           type: string
 *          firstWinner:
 *           schema:
 *            $ref: '#/definitions/winnerStruct'
 *          secondWinner:
 *           schema:
 *            $ref: '#/definitions/winnerStruct'
 *          thirdWinner:
 *           schema:
 *            $ref: '#/definitions/winnerStruct'
 *        partners:
 *         type: object
 *         properties:
 *          description:
 *           type: string
 *          list:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             logo:
 *              type: string
 *             link:
 *              type: string
 *        links:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           name:
 *            type: string
 *           link:
 *            type: string
 * 
 */

/**
 * @swagger
 * definitions:
 *   winnerStruct:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *        logo:
 *         type: string
 */

module.exports = routes;
