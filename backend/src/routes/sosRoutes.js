const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { triggerSOS, getSosHistory, resolveSOS } = require("../controllers/sosController");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

// ── Trigger SOS ───────────────────────────────────────────────────────────────
router.post(
  "/",
  [
    body("coordinates")
      .isArray({ min: 2, max: 2 })
      .withMessage("coordinates must be [longitude, latitude]."),
    body("coordinates.*").isFloat().withMessage("Coordinates must be numbers."),
  ],
  validate,
  triggerSOS
);

// ── History ───────────────────────────────────────────────────────────────────
router.get("/history", getSosHistory);

// ── Resolve (caretaker or elder) ──────────────────────────────────────────────
router.patch(
  "/:id/resolve",
  [body("status").notEmpty().withMessage("Status is required.")],
  validate,
  resolveSOS
);

module.exports = router;
