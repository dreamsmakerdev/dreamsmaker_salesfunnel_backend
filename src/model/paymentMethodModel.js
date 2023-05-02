/**
 * paymentMethodModel.js
 * @description :: model of a database collection of paymentMethodModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },

    paymentMethodId: { type: Array },

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

const PaymentMethodModel = mongoose.model("card", schema, "card");
module.exports = PaymentMethodModel;
