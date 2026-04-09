const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStatus,
  getTodaySchedule,
} = require("../controllers/medicineController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

const timingValidator = body("timings")
  .isArray({ min: 1 })
  .withMessage("At least one timing is required.");

// ── Today's schedule ──────────────────────────────────────────────────────────
router.get("/today", getTodaySchedule);

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.get("/", getMedicines);
router.get("/:id", getMedicine);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Medicine name is required."),
    body("dosage").trim().notEmpty().withMessage("Dosage is required."),
    body("startDate").isISO8601().withMessage("startDate must be a valid date."),
    timingValidator,
  ],
  validate,
  addMedicine
);

router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
    body("dosage").optional().trim().notEmpty().withMessage("Dosage cannot be empty."),
    body("startDate").optional().isISO8601().withMessage("startDate must be a valid date."),
  ],
  validate,
  updateMedicine
);

router.delete("/:id", deleteMedicine);

// ── Status update ─────────────────────────────────────────────────────────────
router.patch(
  "/:id/status",
  [body("status").notEmpty().withMessage("Status is required.")],
  validate,
  updateMedicineStatus
);

module.exports = router;
