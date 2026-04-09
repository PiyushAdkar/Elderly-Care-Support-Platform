const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  getContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/", getContacts);
router.get("/:id", getContact);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("relation").trim().notEmpty().withMessage("Relation is required."),
    body("phone").trim().notEmpty().withMessage("Phone is required."),
    body("type")
      .isIn(["family", "doctor", "caretaker", "neighbor", "other"])
      .withMessage("Type must be family, doctor, caretaker, neighbor, or other."),
  ],
  validate,
  addContact
);

router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
    body("phone").optional().trim().notEmpty().withMessage("Phone cannot be empty."),
    body("type")
      .optional()
      .isIn(["family", "doctor", "caretaker", "neighbor", "other"])
      .withMessage("Invalid contact type."),
  ],
  validate,
  updateContact
);

router.delete("/:id", deleteContact);

module.exports = router;
