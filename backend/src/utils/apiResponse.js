/**
 * Send a standardized success response.
 * @param {Response} res
 * @param {number}   statusCode
 * @param {string}   message
 * @param {*}        data
 * @param {object}   meta  - optional pagination / extra info
 */
const sendSuccess = (res, statusCode = 200, message = "Success", data = null, meta = null) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

/**
 * Send a standardized error response.
 */
const sendError = (res, statusCode = 500, message = "Internal Server Error", errors = null) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
