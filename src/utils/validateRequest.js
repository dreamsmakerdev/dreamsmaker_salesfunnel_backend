/**
 * validateRequest.js
 * @description :: exports methods for validating parameters of request body using joi validation.
 */

/**
 * @description : validate request body parameter with joi.
 * @param {obj} payload : body from request.
 * @param {obj} schemaKeys : model wise schema keys. ex. user validation.
 * @returns : returns validation with message {isValid, message}
 */
exports.validateParamsWithJoi = (payload, schemaKeys) => {
  const { value, error } = schemaKeys.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return {
      isValid: false,
      message,
    };
  }
  return { isValid: true, value };
};
