/* eslint-disable no-useless-escape */
const mime = require("mime");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION,
});

const FilePathProfile = (fileName, folderName) => `NFT/${folderName}/${fileName}`;

const uploadS3 = (buff, uploadFilePath, contentType) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: uploadFilePath,
        Body: buff,
        ACL: "public-read",
        ContentType: contentType,
    };

    return new Promise((resolve, reject) => {
        s3.upload({ ...params }, async (s3Err, data) => {
            if (s3Err) {
                console.log("🚀 ~ file: fileHelper.js ~ line 44 ~ s3Err", s3Err.message);
                return reject({
                    success: false,
                    message: "Upload to S3 failed",
                    error: s3Err,
                });
            } else {
                return resolve({
                    success: true,
                    path: data.Location,
                    message: "Upload to S3 successful",
                });
            }
        });
    });
};

const decodeBase64Image = (dataString) => {
    const indexOfComma = dataString.indexOf(",");
    if (indexOfComma >= 0) {
        const header = dataString.substr(0, indexOfComma);
        const contentType = header.split(":")[1].split(";")[0];
        const dataPart = dataString.substr(indexOfComma + 1);
        const fileExt = contentType.split("/")[1];
        const response = {};

        response.data = Buffer.from(dataPart, "base64");
        response.ext = fileExt;
        response.fileName = `${uuidv4()}.${fileExt}`;
        response.fileContentType = contentType;

        return { ...response, success: true };
    } else {
        return { success: false, message: "Invalid Base64" };
    }
};

/**
 *
 * @param {String} base64
 * @param {String} folderName
 * @returns {Promise}
 *
 * Takes file base64 and then uploads it to server under NFT/ directory
 */
exports.uploadProfile = async (base64, folderName) => {
    try {
        const decodedImg = decodeBase64Image(base64);
        if (!decodedImg.success) {
            return decodedImg;
        }

        return uploadS3(
            decodedImg.data,
            FilePathProfile(decodedImg.fileName, folderName),
            decodedImg.fileContentType
        );
    } catch (error) {
        return error;
    }
};

