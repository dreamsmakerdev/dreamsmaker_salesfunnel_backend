/**
 * index.js
 * @description :: index route of platforms
 */

const express = require("express");

const router = express.Router();

router.use("/web", require("./web/index"));
router.use("/admin", require("./admin/index"));

module.exports = router;
