const mongoose = require("mongoose");

const dbUri = process.env.DB_URI;
exports.connect = () => mongoose.connect(dbUri);
