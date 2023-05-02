/**
 * authController.js
 * @description :: exports authentication methods
 */
const NftModel = require("../../model/nftModel");
const nftValidation = require("../../utils/validation/nftValidation");
const validation = require("../../utils/validateRequest");
const { isValidObjectId, getLimitAndSkipSize } = require("../../utils/common");
const {
  NFT_VIDEO_SEARCH_TYPE,
  PAYMENT_STATUS,
} = require("../../utils/constant");
const PaymentSessionModel = require("../../model/paymentSessionModel");
const { default: mongoose } = require("mongoose");
const { uploadProfile } = require("../../utils/fileHelper");

exports.createNft = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      nftValidation.validNftCreateOrUpdateDetails
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }
    const photo = await uploadProfile(validateRequest.value.photo, "images");
    if (!photo.success) {
      return res.badRequest({ message: photo.message });
    }

    const video = await uploadProfile(validateRequest.value.video, "videos");
    if (!video.success) {
      return res.badRequest({ message: video.message });
    }

    const nftCrete = new NftModel({
      ...validateRequest.value,
      remainingUnit: validateRequest.value.number,
      video: video.path,
      photo: photo.path,
    });

    await nftCrete.save();
    return res.ok({
      message: "SuccessFully Create nftData..",
      data: nftCrete,
    });
  } catch (error) {
    if (!error?.success) {
      return res.badRequest({ message: error.message });
    }
    return res.failureResponse();
  }
};

exports.updateNft = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.badRequest({ message: "Invalid NftId Formate" });
    }

    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      nftValidation.validNftCreateOrUpdateDetails
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }

    const isExitsNftData = await NftModel.findById({ _id: req.params.id });
    if (!isExitsNftData) {
      return res.badRequest({ message: "Invalid NftId Data Not Found" });
    }

    let { video, photo } = validateRequest.value;

    if (isExitsNftData.video !== video) {
      video = await uploadProfile(video, "videos");
      if (!video.success) {
        return res.badRequest({ message: video.message });
      }
    }
    if (isExitsNftData.photo !== photo) {
      photo = await uploadProfile(photo, "images");
      if (!photo.success) {
        return res.badRequest({ message: photo.message });
      }
    }

    const sold = await PaymentSessionModel.countDocuments({
      nftId: req.params.id,
      status: PAYMENT_STATUS.SUCCESS,
      isDeleted: false
    })

    if(validateRequest.value.number < sold ){
      return res.badRequest({message: "units entered are less then sold units"})
    }

    const remainingNftUnit = validateRequest.value.number - sold

    if(remainingNftUnit < 0 ){
      return res.badRequest({
        message: 'Remaining NFT quantity cannot be less than 0 ',
        data:{  
              NoofQuantity: validateRequest.value.number,
              NoofSold: sold,
              remainingUnits: remainingNftUnit
            }
         })
  }

    await NftModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...validateRequest.value,
          remainingUnit: remainingNftUnit,
          video: video.path,
          photo: photo.path,
        },
      }
    );
    return res.ok({
      message: "SuccessFully Update NftData..",
    });
  } catch (error) {
    if (!error?.success) {
      return res.badRequest({ message: error.message });
    }
    return res.failureResponse();
  }
};

exports.deleteNft = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.badRequest({ message: "Invalid NftId Formate" });
    }
    const isExitsNftData = await NftModel.findById({ _id: req.params.id });
    if (!isExitsNftData) {
      return res.badRequest({ message: "Invalid NftId Data Not Found" });
    }

    await NftModel.findByIdAndDelete({ _id: req.params.id });
    return res.ok({
      message: "SuccessFully Delete NftData..",
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.getNftList = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.query,
      nftValidation.validNftListGet
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params ${validateRequest.message}`,
      });
    }
    const { searchType } = validateRequest.value;
    let [, limit, skip] = getLimitAndSkipSize(
      validateRequest.value.page,
      validateRequest.value.limit
    );

    let obj = {};
    if (searchType === NFT_VIDEO_SEARCH_TYPE.FEATURED) {
      obj = { featured: true };
    }

    const nftDataLength = await NftModel.find().count();

    const nftData = await NftModel.aggregate([
      {
        $match: obj,
      },
      { $sort: { featured: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res.ok({
      message: "SuccessFully NftData Get..",
      data: { list: nftData, total: nftDataLength },
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.nftPriceUpdate = async () => {
  const date = new Date();
  const newDate = new Date(
    new Date().setSeconds(new Date().getSeconds() - 172700)
  );

  await NftModel.updateMany(
    {
      priceIncrementTime: { $lt: 7 },
      priceUpdatedDate: {
        $lte: newDate,
      },
    },
    {
      $inc: { price: 0.01, priceIncrementTime: 1 },
      $set: { priceUpdatedDate: date },
    }
  );
};

exports.getNftPurchaseList = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.query,
      nftValidation.validNftPurchaseListGet
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params ${validateRequest.message}`,
      });
    }
    let [, limit, skip] = getLimitAndSkipSize(
      validateRequest.value.page,
      validateRequest.value.limit
    );
    const matchData = {
      userId: new mongoose.Types.ObjectId(req.userId),
      status: PAYMENT_STATUS.SUCCESS,
    };

    const totalDocument = await PaymentSessionModel.find(matchData).count();

    const getPurchaseList = await PaymentSessionModel.aggregate([
      {
        $match: matchData,
      },
      {
        $lookup: {
          from: "nft",
          localField: "nftId",
          foreignField: "_id",
          as: "nftData",
        },
      },
      {
        $unwind: {
          path: "$nftData",
          preserveNullAndEmptyArrays: false,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    if (getPurchaseList.length === 0) {
      return res.noContent();
    }
    return res.ok({
      message: "SuccessFully User Nft Purchase List..",
      data: { list: getPurchaseList, total: totalDocument },
    });
  } catch (error) {
    return res.failureResponse();
  }
};
