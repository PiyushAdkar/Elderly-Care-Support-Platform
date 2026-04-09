const logger = require("../utils/logger");
const { sendError } = require("../utils/apiResponse");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} — ${err.stack || err.message}`);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 422, "Validation failed.", errors);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return sendError(res, 400, `Invalid value for field '${err.path}'.`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `'${field}' already exists.`);
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return sendError(
      res,
      413,
      `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.`
    );
  }

  // Multer unexpected field error
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return sendError(res, 400, "Unexpected file field in the upload request.");
  }

  // Custom operational error (thrown with err.statusCode)
  if (err.isOperational) {
    return sendError(res, err.statusCode || 400, err.message);
  }

  // JWT errors (caught here if not caught upstream)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return sendError(res, 401, err.message);
  }

  // Default 500
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message;

  return sendError(res, 500, message);
};

/**
 * Helper to create an operational error and pass it to next().
 */
const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
};

module.exports = { errorHandler, createError };
