/**
 * auth.js
 * @description :: routes of authentication APIs
 */

const express = require("express");

const routes = express.Router();
const authController = require("../../controller/web/authController");
const webAuth = require("../../middleware/webAuth");

/**
 * @swagger
 * /web/auth/login:
 *  post:
 *   summary: This API is for login of user
 *   description: This API is for login of user
 *   tags:
 *    - User Auth
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: email of the user
 *         example: Raghu@gmail.com
 *        password:
 *         type: string
 *         description: password for the user
 *         example: Raghu123
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/login", authController.loginUser);

/**
 * @swagger
 * /web/auth/signUp:
 *  post:
 *   summary: This API is for SignUp user
 *   description: This API is for SignUp user
 *   tags:
 *    - User Auth
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        firstName:
 *         type: string
 *         description: first name
 *         example: Raghu
 *        lastName:
 *         type: string
 *         description: last name
 *         example: Raghu
 *        username:
 *         type: string
 *         description: username
 *         example: Raghu@123
 *        email:
 *         type: string
 *         description: email
 *         example: Raghu@gmail.com
 *        password:
 *         type: string
 *         description: password
 *         example: Raghu123
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/signUp", authController.signUpUser);

/**
 * @swagger
 * /web/auth/logout:
 *  post:
 *   summary: user logout
 *   description: user logout API, it will logout the user and remove all the tokens from the db
 *   tags:
 *    - User Auth
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/logout", webAuth, authController.logoutUser);

/**
 * @swagger
 * /web/auth/userCheck:
 *  post:
 *   summary: user name check
 *   description: user name check API
 *   tags:
 *    - User Auth
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *         description: username
 *         example: Raghu@123
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/userCheck", authController.checkUserNameAvailable);

module.exports = routes;
