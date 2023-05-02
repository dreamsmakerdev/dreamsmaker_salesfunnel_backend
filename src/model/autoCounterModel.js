/**
 * clients.js
 * @description :: model of a database collection of clients
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { paginatorCustomLabels } = require('../db/config');

mongoosePaginate.paginate.options = { customLabels: paginatorCustomLabels };
const { Schema } = mongoose;
const schema = new Schema(
  {
    name: { type: String },

    autoId: { type: Number },

    createdAt: { type: Date },

    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre('insertMany', async (next, docs) => {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index += 1) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  return object;
});
schema.plugin(mongoosePaginate);

const autoCounterSchema = mongoose.model('autoCounter', schema, 'autoCounter');
module.exports = autoCounterSchema;
