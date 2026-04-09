const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { processVoiceCommand } = require("../controllers/voiceController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.post(
  "/",
  [body("command").trim().notEmpty().withMessage("command text is required.")],
  validate,
  processVoiceCommand
);

module.exports = router;
