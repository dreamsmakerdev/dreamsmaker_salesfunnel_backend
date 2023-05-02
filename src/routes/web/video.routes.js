/**
 * video.routes.js
 * @description :: routes of video APIs
 */

const express = require("express");
const adminAuth = require("../../middleware/adminAuth");

const routes = express.Router();
const {
  findVideo,
  deleteVideo,
  updateVideo,
  createVideo,
} = require("../../controller/web/videoController");

/**
 * @swagger
 * /web/video:
 *  get:
 *   summary: This API is for video list get
 *   description: This API is for video list get
 *   tags:
 *    - User Video
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
routes.get("/", findVideo);

/**
 * @swagger
 * /web/video:
 *  post:
 *   summary: This API is for video store
 *   description: This API is for video store
 *   tags:
 *    - User Video
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *         description: title of the video
 *        video:
 *         type: string
 *         description: video
 *        photo:
 *         type: string
 *         description: photo
 *        featured:
 *         type: boolean
 *         description: featured
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.post("/", adminAuth, createVideo);

/**
 * @swagger
 * /web/video/{id}:
 *  put:
 *   summary: This API is for video update
 *   description: This API is for video update
 *   tags:
 *    - User Video
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        require: true
 *        description: videoId
 *        example: ""
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *         description: title of the video
 *        video:
 *         type: string
 *         description: video
 *        photo:
 *         type: string
 *         description: photo
 *        featured:
 *         type: boolean
 *         description: featured
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.put("/:id", adminAuth, updateVideo);

/**
 * @swagger
 * /web/video/{id}:
 *  delete:
 *   summary: This API is for video delete
 *   description: This API is for video delete
 *   tags:
 *    - User Video
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *           type: string
 *        require: true
 *        description: videoId
 *        example: ""
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
routes.delete("/:id", adminAuth, deleteVideo);

module.exports = routes;
