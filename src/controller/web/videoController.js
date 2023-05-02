/**
 * authController.js
 * @description :: exports authentication methods
 */

const VideoModel = require("../../model/videoModel");
const validVideoCreateDetails = require("../../utils/validation/videoValidation");
const validation = require("../../utils/validateRequest");
const { isValidObjectId, getLimitAndSkipSize } = require("../../utils/common");
const { NFT_VIDEO_SEARCH_TYPE } = require("../../utils/constant");
const { uploadProfile } = require("../../utils/fileHelper");

exports.createVideo = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      validVideoCreateDetails.validVideoCreateOrUpdateDetails
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }
    const video = await uploadProfile(validateRequest.value.video, "videos");
    if (!video.success) {
      return res.badRequest({ message: video.message });
    }
    const photo = await uploadProfile(validateRequest.value.photo, "images");
    if (!photo.success) {
      return res.badRequest({ message: photo.message });
    }
    const videoCrete = new VideoModel({
      ...validateRequest.value,
      video: video.path,
      photo: photo.path,
    });
    await videoCrete.save();
    return res.ok({
      message: "SuccessFully Create Video..",
      data: videoCrete,
    });
  } catch (error) {
    if (!error?.success) {
      return res.badRequest({ message: error.message });
    }
    return res.failureResponse();
  }
};

exports.updateVideo = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.badRequest({ message: "Invalid VideoId Formate" });
    }

    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      validVideoCreateDetails.validVideoCreateOrUpdateDetails
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
      });
    }

    const isExitsVideo = await VideoModel.findById({ _id: req.params.id });
    if (!isExitsVideo) {
      return res.badRequest({ message: "Invalid VideoId Data Not Found" });
    }
    let { video, photo } = validateRequest.value;
    const { title, featured } = validateRequest.value;

    if (isExitsVideo.video !== video) {
      video = await uploadProfile(video);
      if (!video.success) {
        return res.badRequest({ message: video.message });
      }
      video = video.path;
    }
    if (isExitsVideo.photo !== photo) {
      photo = await uploadProfile(photo);
      if (!photo.success) {
        return res.badRequest({ message: photo.message });
      }
      photo = photo.path;
    }

    await VideoModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { title, featured, photo, video } }
    );
    return res.ok({
      message: "SuccessFully Update Video..",
    });
  } catch (error) {
    if (!error?.success) {
      return res.badRequest({ message: error.message });
    }
    return res.failureResponse({ message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.badRequest({ message: "Invalid VideoId Formate" });
    }
    const isExitsVideo = await VideoModel.findById({ _id: req.params.id });
    if (!isExitsVideo) {
      return res.badRequest({ message: "Invalid VideoId Data Not Found" });
    }

    await VideoModel.findByIdAndDelete({ _id: req.params.id });
    return res.ok({
      message: "SuccessFully Delete Video..",
    });
  } catch (error) {
    return res.failureResponse();
  }
};

exports.findVideo = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.query,
      validVideoCreateDetails.validVideoListGet
    );

    if (!validateRequest.isValid) {
      return res.badRequest({
        message: `Invalid Params : ${validateRequest.message}`,
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
    const videoDataLength = await VideoModel.find().count();
    const videoData = await VideoModel.aggregate([
      {
        $match: obj,
      },
      { $sort: { featured: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res.ok({
      message: "SuccessFully Video Get..",
      data: { list: videoData, total: videoDataLength },
    });
  } catch (error) {
    return res.failureResponse();
  }
};
