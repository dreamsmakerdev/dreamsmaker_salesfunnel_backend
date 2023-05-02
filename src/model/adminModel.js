/**
 * adminModel.js
 * @description :: model of a database collection of adminModel
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    name: { type: String },

    email: {
      type: String,
      unique: true,
    },

    password: { type: String, required: true },

    isActive: { type: Boolean },

    createdAt: { type: Date },

    updatedAt: { type: Date },

    isDeleted: { type: Boolean },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.pre("save", async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

schema.method("toJSON", function () {
  const { _id, __v, password, ...object } = this.toObject({ virtuals: true });
  return object;
});
schema.plugin(mongoosePaginate);

const AdminModel = mongoose.model("admin", schema, "admin");
module.exports = AdminModel;
