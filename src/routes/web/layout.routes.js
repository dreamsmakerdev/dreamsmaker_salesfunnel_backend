/**
 * video.routes.js
 * @description :: routes of video APIs
 */

const express = require("express");
const { getPageLayout } = require("../../controller/web/layoutController");

const routes = express.Router();

/**
 * @swagger
 * /web/layout:
 *  get:
 *   summary: This API returns the layout of website
 *   description: This API returns the layout of website
 *   tags:
 *    - Site Layout
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.get("/", getPageLayout);

module.exports = routes;
