/**
 * messages.js
 * @description :: exports all response for APIS.
 */

const responseCode = require('./responseCode');

/**
 * @description: exports response format of all APIS
 * @param {obj | Array} data : object which will returned in response.
 * @param {obj} res : response from controller method.
 * @return {obj} : response for API {status, message, data}
 */
module.exports = {
  successResponse: (data, res) =>
    res.status(responseCode.success).json({
      status: 'SUCCESS',
      message: data.message || 'Your request is successfully executed',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),

  noContent: (data, res) =>
    res.status(responseCode.noContent).json({
      status: 'SUCCESS',
      message: data.message || 'No Content',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),

  failureResponse: (data, res) =>
    res.status(responseCode.internalServerError).json({
      status: 'FAILURE',
      message: data.message || 'Internal server error.',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),

  badRequest: (data, res) =>
    res.status(responseCode.badRequest).json({
      status: 'BAD_REQUEST',
      message:
        data.message || 'The request cannot be fulfilled due to bad syntax.',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),

  insufficientParameters: (data, res) =>
    res.status(responseCode.badRequest).json({
      status: 'BAD_REQUEST',
      message: data.message || 'Insufficient parameters.',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),

  unAuthorizedRequest: (data, res) =>
    res.status(responseCode.unAuthorizedRequest).json({
      status: 'UNAUTHORIZED',
      message: data.message || 'You are not authorized to access the request.',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),

  accessForbidden: (data, res) =>
    res.status(responseCode.accessForbidden).json({
      status: 'ACCESS_FORBIDEN',
      message: data.message || 'You are not authorized to access the request.',
      data: data.data && Object.keys(data.data).length ? data.data : [],
    }),
};
