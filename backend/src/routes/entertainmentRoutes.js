const express = require("express");
const router = express.Router();

const {
  getMusicCategories,
  getStoryCategories,
  getEntertainment,
} = require("../controllers/entertainmentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/",        getEntertainment);
router.get("/music",   getMusicCategories);
router.get("/stories", getStoryCategories);

module.exports = router;
