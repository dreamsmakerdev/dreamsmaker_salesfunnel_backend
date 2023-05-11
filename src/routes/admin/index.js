/**
 * index.js
 * @description :: index route file of device platform.
 */

const express = require("express");

const router = express.Router();
router.use("/auth", require("./auth.routes"));
router.use("/nft", require("./nft.routes"));
router.use("/layout", require("./layout.routes"));

module.exports = router;
