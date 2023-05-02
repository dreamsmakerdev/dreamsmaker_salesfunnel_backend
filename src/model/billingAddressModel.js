/**
 * billingAddressModel.js
 * @description :: model of a database collection of billingAddressModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    address: {
      country: { type: String },
      state: { type: String },
      city: { type: String },
      line1: { type: String },
      postal_code: { type: Number },
    },

    name: { type: String },

    userId: { type: mongoose.Types.ObjectId, required: true },

    createdAt: { type: Date },

    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  return object;
});

schema.plugin(mongoosePaginate);

const BillingAddressModel = mongoose.model(
  "billingAddress",
  schema,
  "billingAddress"
);
module.exports = BillingAddressModel;
