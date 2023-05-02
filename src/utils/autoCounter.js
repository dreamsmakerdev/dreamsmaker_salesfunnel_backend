const AutoCounterSchema = require('../model/autoCounterModel');

exports.createAutoId = async (name) => {
  const newAutoId = await AutoCounterSchema.findOneAndUpdate(
    { name },
    {
      $inc: { autoId: 1 },
      $set: {
        name,
      },
    },
    { new: true, upsert: true },
  );

  return newAutoId.autoId;
};
