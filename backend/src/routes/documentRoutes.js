const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  getDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload = require("../utils/upload");

router.use(protect);

router.get("/",        getDocuments);
router.get("/:id",     getDocument);
router.get("/:id/download", downloadDocument);

router.post(
  "/",
  upload.single("file"),
  [
    body("type")
      .optional()
      .isIn(["prescription", "lab_report", "discharge_summary", "insurance", "id_proof", "scan", "other"])
      .withMessage("Invalid document type."),
  ],
  validate,
  uploadDocument
);

router.put(
  "/:id",
  [
    body("type")
      .optional()
      .isIn(["prescription", "lab_report", "discharge_summary", "insurance", "id_proof", "scan", "other"])
      .withMessage("Invalid document type."),
    body("isArchived").optional().isBoolean().withMessage("isArchived must be boolean."),
  ],
  validate,
  updateDocument
);

router.delete("/:id", deleteDocument);

module.exports = router;
