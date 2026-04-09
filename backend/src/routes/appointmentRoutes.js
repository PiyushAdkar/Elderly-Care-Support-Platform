const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  getDoctors,
  getAppointments,
  getAppointment,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  shareReport,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

// ── Doctor listing (telemedicine) ──────────────────────────────────────────────
router.get("/doctors", getDoctors);

// ── Appointments ──────────────────────────────────────────────────────────────
router.get("/", getAppointments);
router.get("/:id", getAppointment);

router.post(
  "/",
  [
    body("doctorName").trim().notEmpty().withMessage("Doctor name is required."),
    body("date").isISO8601().withMessage("date must be a valid ISO date."),
    body("time").trim().notEmpty().withMessage("time is required (e.g. 10:30 AM)."),
  ],
  validate,
  bookAppointment
);

router.put(
  "/:id",
  [
    body("date").optional().isISO8601().withMessage("date must be a valid ISO date."),
    body("status")
      .optional()
      .isIn(["scheduled", "completed", "cancelled", "missed", "rescheduled"])
      .withMessage("Invalid appointment status."),
  ],
  validate,
  updateAppointment
);

router.patch("/:id/cancel", cancelAppointment);

// ── Share report with doctor ───────────────────────────────────────────────────
router.post(
  "/share-report",
  [
    body("appointmentId").notEmpty().withMessage("appointmentId is required."),
    body("documentId").notEmpty().withMessage("documentId is required."),
    body("doctorEmail").isEmail().withMessage("Valid doctorEmail is required."),
  ],
  validate,
  shareReport
);

module.exports = router;
