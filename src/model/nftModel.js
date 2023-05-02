/**
 * nftModel.js
 * @description :: model of a database collection of nftModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    name: { type: String, required: true },

    number: {
      type: Number,
      required: true,
    },

    price: { type: Number, required: true },

    remainingUnit: {type: Number},
    
    description: { type: String, required: true },

    video: { type: String },

    photo: { type: String },

    sold: { type: Boolean },

    floorPrice: { type: Number },

    collectionName: { type: String },

    collectionIcon: { type: String },

    contractAddress: { type: String },

    featured: { type: Boolean },

    priceIncrementTime: { type: Number, default: 1 },

    priceUpdatedDate: { type: Date },

    createdAt: { type: Date },

    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      priceUpdatedDate: "createdAt",
    },
  }
);

schema.pre("save", async function (next) {
  next();
});

schema.pre("insertMany", async (next, docs) => {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index += 1) {
      const element = docs[index];
    }
  }
  next();
});

schema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  return object;
});

schema.plugin(mongoosePaginate);

const NftModel = mongoose.model("nft", schema, "nft");
module.exports = NftModel;
