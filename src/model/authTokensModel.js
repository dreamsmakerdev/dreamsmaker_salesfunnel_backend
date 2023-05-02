/**
 * userTokens.js
 * @description :: model of a database collection userTokens
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { paginatorCustomLabels } = require('../db/config');

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },

    token: { type: String },

    refreshToken: { type: String },

    hasExpired: { type: Boolean },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
schema.pre('save', async function (next) {
  this.hasExpired = false;
  this.isActive = true;
  next();
});

schema.pre('insertMany', async (next, docs) => {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index += 1) {
      const element = docs[index];
      element.hasExpired = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  object.token = undefined;
  return object;
});
schema.plugin(mongoosePaginate);

const AuthTokensModel = mongoose.model('authTokens', schema, 'authTokens');
module.exports = AuthTokensModel;
