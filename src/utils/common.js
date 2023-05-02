const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const secretKey = process.env.SECRET_KEY;
const jwtExpiry = process.env.JWTEXPIRY || 1440;
const jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY || 1440;
const AuthToken = require("../model/authTokensModel");

/**
 * @description : service to generate JWT token for authentication.
 * @param {String} userid : id of the user.
 * @return {string}  : returns JWT token.
 */
exports.generateToken = async (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    secretKey,
    { expiresIn: jwtExpiry * 60 }
  );

  const refreshToken = jwt.sign(
    {
      userId,
    },
    secretKey,
    { expiresIn: jwtRefreshExpiry * 60 }
  );
  await AuthToken.create({
    userId,
    token,
    refreshToken,
  });
  return { token, refreshToken };
};

/**
 *
 * @param {String} id String that needs to be checked for the id
 * @returns
 */
exports.isValidObjectId = (id) => {
  if (!id || id.length === 0) {
    return false;
  }

  if (id.toString().match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  }
  return false;
};

/**
 *
 * @param {Number} page this is the current pageNo
 * @param {Number} limit this is the limit of items per page
 * @returns {Array} 0: limit, 1: pageNo, 2: skipsize
 */
exports.getLimitAndSkipSize = (page, limit) => {
  let pageNo = parseInt(page);

  if (!pageNo) {
    pageNo = 1;
  }

  limit = parseInt(limit);
  if (!limit) {
    limit = 10;
  }

  const skipSize = (pageNo - 1) * limit;

  return [pageNo, limit, skipSize];
};

/**
 *
 * @param {Any} object This is the object that needs to be converted into the enum
 * @returns
 *
 * Works only for string and number
 */
exports.convertObjectToEnum = (object) =>
  Object.entries(object).map((e) => e[1]);

exports.checkTokenValidity = async (token) =>
  new Promise((res, rej) => {
    (async () => {
      try {
        const decoded = jwt.verify(token, secretKey);
        const tokenData = await AuthToken.findOne({
          token,
          userId: mongoose.Types.ObjectId(decoded.userId),
          hasExpired: false,
          isActive: true,
        });
        if (tokenData) {
          res({
            userId: decoded.userId,
          });
        } else {
          rej("Your Token Is Expire.....");
        }
      } catch (err) {
        rej("Your Token Is Expire.....");
      }
    })();
  });
