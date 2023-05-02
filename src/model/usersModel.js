/**
 * usersModel.js
 * @description :: model of a database collection of usersModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    username: { type: String, required: true, unique: true },

    email: {
      type: String,
      unique: true,
    },

    firstName: { type: String, required: true },

    lastName: { type: String, required: true },

    password: { type: String, required: true },

    customerId: { type: String },

    phone: { type: String },

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

  next();
});

schema.pre("insertMany", async (next, docs) => {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index += 1) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method("toJSON", function () {
  const { _id, __v, password, ...object } = this.toObject({ virtuals: true });
  return object;
});

schema.plugin(mongoosePaginate);

const UsersModel = mongoose.model("users", schema, "users");
module.exports = UsersModel;
