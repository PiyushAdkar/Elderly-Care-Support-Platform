const { validationResult } = require("express-validator");
const { sendError } = require("../utils/apiResponse");

/**
 * Run after express-validator chains.
 * Collects errors and responds with 422 if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`);
    return sendError(res, 422, "Validation failed.", messages);
  }
  next();
};

module.exports = validate;
