const validation = require("../../utils/validateRequest");
const { getLimitAndSkipSize } = require("../../utils/common");
const PaymentSessionModel = require("../../model/paymentSessionModel");
const { layoutUpdateValidation } = require("../../utils/validation/layoutValidation");
const { uploadLayoutFromFilePath, uploadLayout } = require("../../utils/fileHelper");
const LayoutModel = require("../../model/layoutModel");

const checkForNewAssetAndUpload = async (asset) => {
    if (asset.startsWith("https://")) {
        return asset;
    }

    const uploadData = await uploadLayout(asset);

    if (!uploadData.path) {
        throw new Error("Error while uploading asset");
    }

    return uploadData.path;
};

const checkAndUploadPartnerImages = async (partnerArray) => {
    const newPartnerArray = partnerArray.map(async (ele) => {
        const partnerImage = await checkForNewAssetAndUpload(ele.logo);
        ele.logo = partnerImage;

        return ele;
    });

    return Promise.all(newPartnerArray);
};

exports.updateSiteLayout = async (req, res) => {
    try {
      console.log("🚀 ~ file: layoutController.js:36 ~ exports.updateSiteLayout= ~ req.body:", req.body)
      const validateRequest = validation.validateParamsWithJoi(req.body, layoutUpdateValidation);

        if (!validateRequest.isValid) {
            return res.badRequest({
                message: `Invalid Params ${validateRequest.message}`,
            });
        }

        const finalObject = validateRequest.value;
        console.log(
            "🚀 ~ file: layoutController.js:31 ~ exports.updateNFTLayout= ~ finalObject:",
            finalObject
        );

        const bgVideo = await checkForNewAssetAndUpload(finalObject.landing.backgroundVideo);

        finalObject.landing.backgroundVideo = bgVideo;

        const mintImage = await checkForNewAssetAndUpload(finalObject.mintChecker.image);

        finalObject.mintChecker.image = mintImage;

        const discord = await checkForNewAssetAndUpload(finalObject.discord.video);

        finalObject.discord.video = discord;

        const partners = await checkAndUploadPartnerImages(finalObject.partners.list);
        console.log("🚀 ~ file: layoutController.js:62 ~ exports.updateSiteLayout= ~ partners:", partners)

        finalObject.partners.list = partners;

        await LayoutModel.deleteMany({});

        const layout = new LayoutModel(finalObject);
        await layout.save();

        return res.ok({
            message: "Success..",
        });
    } catch (error) {
        console.log("🚀 ~ file: layoutController.js:77 ~ exports.updateSiteLayout= ~ error:", error)
        return res.failureResponse();
    }
};

exports.getPageLayout = async (req, res) => {
    try {
        const layoutData = await LayoutModel.find();

        if (layoutData.length < 1) {
            return res.failureResponse({ message: "No data found" });
        }

        return res.ok({
            message: "Got page layout",
            data: layoutData[0],
        });
    } catch (error) {
        return res.failureResponse();
    }
};

