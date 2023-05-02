/**
 * responseHandler.js
 * @description :: exports all handlers for response format.
 */

const message = require('./messages');
const _ = require('lodash');
/**
 *
 * @param {obj} req : request from controller.
 * @param {obj} res : response from controller.
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req, res, next) => {
  // When everything is ok.
  res.ok = (data = {}) => {
    message.successResponse(data, res);
  };

  res.noContent = (data = {}) => {
    message.noContent(data, res);
  };

  // Some issues arraised due to user mistake such as invalid data format of data
  res.badRequest = (data = {}) => {
    message.badRequest(data, res);
  };

  // This is when something went wrong or the task was not performed properly
  res.failureResponse = (data = {}) => {
    message.failureResponse(data, res);
  };

  // This is when the parameters are missing
  res.insufficientParameters = (data = {}) => {
    message.insufficientParameters(data, res);
  };

  // This is when a user is trying to access data without token
  res.unAuthorizedRequest = (data = {}) => {
    message.unAuthorizedRequest(data, res);
  };

  // User is authenticated but doesn't have rights to access the requested data
  res.accessForbidden = (data = {}) => {
    message.accessForbidden(data, res);
  };
  next();
};

module.exports = responseHandler;
