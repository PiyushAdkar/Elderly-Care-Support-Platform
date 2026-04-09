const { verifyToken } = require("../utils/jwt");
const { sendError } = require("../utils/apiResponse");
const User = require("../models/User");

/**
 * Protect routes — verifies Bearer JWT and attaches req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendError(res, 401, "Token is valid but user no longer exists.");
    }

    if (!user.isActive) {
      return sendError(res, 403, "Your account has been deactivated.");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Token has expired. Please log in again.");
    }
    if (err.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid token.");
    }
    next(err);
  }
};

/**
 * Restrict access to specific roles.
 * Usage: authorize("caretaker") or authorize("elder", "caretaker")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Role '${req.user.role}' is not permitted for this action.`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
