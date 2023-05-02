/**
 * paymentSessionModel.js
 * @description :: model of a database collection of paymentSessionModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");
const { convertObjectToEnum } = require("../utils/common");
const { PAYMENT_STATUS } = require("../utils/constant");
mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },

    nftId: {
      type: mongoose.Types.ObjectId,
    },

    userId: { type: mongoose.Types.ObjectId },

    usdPrice: { type: Number },

    nftPrice: { type: Number },

    quantity: { type: Number},

    uniqueCode: { type: String, unique: true },

    successURL: { type: String, required: true },

    failedURL: { type: String, required: true },

    status: {
      type: String,
      enum: convertObjectToEnum(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

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

schema.method("toJSON", function () {
  const { _id, __v, password, ...object } = this.toObject({ virtuals: true });
  return object;
});

schema.plugin(mongoosePaginate);

const PaymentSessionModel = mongoose.model(
  "paymentSession",
  schema,
  "paymentSession"
);
module.exports = PaymentSessionModel;
