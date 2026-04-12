const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  logActivity,
  getActivities,
  getTodayActivity,
  getWeeklySummary,
} = require("../controllers/activityController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/today",            getTodayActivity);
router.get("/weekly",           getWeeklySummary);
router.get("/",                 getActivities);

router.post(
  "/",
  [
    body("steps")
      .optional()
      .isInt({ min: 0 })
      .withMessage("steps must be a non-negative integer."),
    body("moodScore")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("moodScore must be between 1 and 5."),
    body("sleepHours")
      .optional()
      .isFloat({ min: 0, max: 24 })
      .withMessage("sleepHours must be between 0 and 24."),
    body("date")
      .optional()
      .isISO8601()
      .withMessage("date must be a valid ISO date."),
  ],
  validate,
  logActivity
);

module.exports = router;
