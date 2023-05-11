/**
 * index.js
 * @description :: index route file of device platform.
 */

const express = require("express");
const webAuth = require("../../middleware/webAuth");

const router = express.Router();
router.use("/auth", require("./auth.routes"));
router.use("/nft", require("./nft.routes"));
router.use("/layout", require("./layout.routes"));
router.use("/video", require("./video.routes"));
router.use("/strip", require("./stripe.routes"));

module.exports = router;
