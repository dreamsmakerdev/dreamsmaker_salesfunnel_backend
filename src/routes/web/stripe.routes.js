const express = require("express");
const {
  registerUser,
  paymentMethodAttach,
  paymentMethodListGet,
  paymentInvoiceGet,
  createCheckoutSession,
  paymentSuccess,
  paymentFailed,
} = require("../../controller/web/stripeController");
const webAuth = require("../../middleware/webAuth");

const routes = express.Router();

// /**
//  * @swagger
//  * /web/strip/user/register:
//  *  post:
//  *   summary: This API is for Strip create
//  *   description: This API is for Strip create
//  *   tags:
//  *    - User Strip
//  *   requestBody:
//  *        required: true
//  *        content:
//  *           application/json:
//  *             schema:
//  *                  $ref: '#/definitions/customerCreate'
//  *   responses:
//  *    200:
//  *     description: success
//  *    500:
//  *     description : error
//  */
// routes.post("/user/register", registerUser);

// /**
//  * @swagger
//  * /web/strip/payment/method/attach:
//  *  post:
//  *   summary: This API is for Strip Payment Method Attach
//  *   description: This API is for Strip Payment Method Attach
//  *   tags:
//  *    - User Strip
//  *   requestBody:
//  *        required: true
//  *        content:
//  *           application/json:
//  *             schema:
//  *                  $ref: '#/definitions/paymentMethodCreate'
//  *   responses:
//  *    200:
//  *     description: success
//  *    500:
//  *     description : error
//  */
// routes.post("/payment/method/attach", paymentMethodAttach);

// /**
//  * @swagger
//  * /web/strip/payment/methods:
//  *  get:
//  *   summary: This API is for Strip Payment Method  get
//  *   description: This API is for Strip Payment Method  get
//  *   tags:
//  *    - User Strip
//  *   parameters:
//  *      - in: query
//  *        name: paymentMethodId
//  *        schema:
//  *           type: string
//  *        require: true
//  *        description: paymentMethodId
//  *        example: pi_1MZs4TJAJfZb9HEBfh1N20YV
//  *   responses:
//  *    200:
//  *     description: success
//  *    500:
//  *     description : error
//  */
// routes.get("/payment/methods", paymentMethodListGet);

// /**
//  * @swagger
//  * /web/strip/payment/invoice:
//  *  get:
//  *   summary: This API is for Strip Payment Invoice get
//  *   description: This API is for Strip Payment Invoice get
//  *   tags:
//  *    - User Strip
//  *   parameters:
//  *      - in: query
//  *        name: paymentId
//  *        schema:
//  *           type: string
//  *        require: true
//  *        description: paymentId
//  *        example: pi_1MZs4TJAJfZb9HEBfh1N20YV
//  *   responses:
//  *    200:
//  *     description: success
//  *    500:
//  *     description : error
//  */
// routes.get("/payment/invoice", paymentInvoiceGet);

/**
 * @swagger
 * /web/strip/create-checkout-session:
 *  post:
 *   summary: This API is for Strip Payment Checkout
 *   description: This API is for Strip Payment Checkout
 *   tags:
 *    - User Strip
 *   requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *                  $ref: '#/definitions/paymentSessionCreate'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/create-checkout-session", webAuth, createCheckoutSession);

routes.get("/payment/success", paymentSuccess);
routes.get("/payment/failed", paymentFailed);

// /**
//  * @swagger
//  * definitions:
//  *   customerCreate:
//  *       type: object
//  *       properties:
//  *        phone:
//  *         type: string
//  *         description: phone
//  */

// /**
//  * @swagger
//  * definitions:
//  *   paymentMethodCreate:
//  *       type: object
//  *       properties:
//  *        cardNumber:
//  *         type: string
//  *         description: cardNumber
//  *         example: 4242424242424242
//  *        expMonth:
//  *         type: string
//  *         description: expMonth
//  *         example: 12
//  *        expYear:
//  *         type: string
//  *         description: expYear
//  *         example: 2025
//  *        name:
//  *         type: string
//  *         description: name
//  *        address:
//  *           $ref: '#/definitions/addressInnerData'
//  */

/**
 * @swagger
 * definitions:
 *   paymentSessionCreate:
 *       type: object
 *       properties:
 *        nftId:
 *         type: string
 *         description: nftId
 *         example: 63e0f40b3e61f465c1dc6887
 *        quantity:
 *         type: number
 *         description: quantity
 *         example: 1
 *        success_url:
 *         type: string
 *         description: success_url
 *         example: http://192.168.29.52:3000/nft/buy/success
 *        cancel_url:
 *         type: string
 *         description: cancel_url
 *         example: http://192.168.29.52:3000/nft/buy/failed
 */

// /**
//  * @swagger
//  * definitions:
//  *   addressInnerData:
//  *       type: object
//  *       properties:
//  *        city:
//  *         type: string
//  *         description: city
//  *        country:
//  *         type: string
//  *         description: country
//  *        state:
//  *         type: string
//  *         description: state
//  *        line1:
//  *         type: string
//  *         description: line1
//  *        postal_code:
//  *         type: number
//  *         description: postal_code
//  */

module.exports = routes;
