/**
 * auth.js
 * @description :: routes of authentication APIs
 */

const express = require("express");

const routes = express.Router();
const authController = require("../../controller/admin/authController");
const adminAuth = require("../../middleware/adminAuth");

/**
 * @swagger
 * /admin/auth/login:
 *  post:
 *   summary: This API is for login of admin
 *   description: This API is for login of admin
 *   tags:
 *    - Admin Auth
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: email of the admin
 *         example: admin@gmail.com
 *        password:
 *         type: string
 *         description: password for the admin
 *         example: admin123
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/login", authController.loginAdmin);

/**
 * @swagger
 * /admin/auth/changePassword:
 *  post:
 *   summary: This API is for admin to change the password for the account
 *   description: This API is for admin to change the password for the account
 *   tags:
 *    - Admin Auth
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        password:
 *         type: string
 *         description: password for the admin
 *         example: admin123
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/changePassword", adminAuth, authController.resetAdminPassword);

/**
 * @swagger
 * /admin/auth/logout:
 *  post:
 *   summary: admin logout
 *   description: admin logout API, it will logout the admin and remove all the tokens from the db
 *   tags:
 *    - Admin Auth
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/logout", adminAuth, authController.logoutAdmin);

module.exports = routes;

