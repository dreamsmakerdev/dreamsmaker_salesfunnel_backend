/**
 * videoModel.js
 * @description :: model of a database collection of videoModel
 */

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { paginatorCustomLabels } = require("../db/config");

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    title: { type: String, required: true },

    video: { type: String, required: true },

    photo: { type: String, required: true },

    featured: { type: Boolean },

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

const VideoModel = mongoose.model("video", schema, "video");
module.exports = VideoModel;
