const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

// ── Signup ────────────────────────────────────────────────────────────────────
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("age").isInt({ min: 1, max: 120 }).withMessage("Age must be between 1 and 120."),
    body("role").optional().isIn(["elder", "caretaker"]).withMessage("Role must be elder or caretaker."),
    body("phone").trim().notEmpty().withMessage("Phone is required."),
    body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  ],
  validate,
  signup
);

// ── Login ─────────────────────────────────────────────────────────────────────
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

// ── Profile (protected) ───────────────────────────────────────────────────────
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ── Change password ───────────────────────────────────────────────────────────
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required."),
    body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters."),
  ],
  validate,
  changePassword
);

module.exports = router;
