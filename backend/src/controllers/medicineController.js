const Medicine = require("../models/Medicine");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── Get all medicines for the logged-in user ─────────────────────────────────
const getMedicines = async (req, res, next) => {
  try {
    const { status, frequency } = req.query;
    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (frequency) filter.frequency = frequency;

    const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Medicines fetched.", medicines);
  } catch (err) {
    next(err);
  }
};

// ─── Get single medicine ──────────────────────────────────────────────────────
const getMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!medicine) return sendError(res, 404, "Medicine not found.");
    return sendSuccess(res, 200, "Medicine fetched.", medicine);
  } catch (err) {
    next(err);
  }
};

// ─── Add medicine ─────────────────────────────────────────────────────────────
const addMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create({
      ...req.body,
      userId: req.user._id,
    });
    return sendSuccess(res, 201, "Medicine added.", medicine);
  } catch (err) {
    next(err);
  }
};

// ─── Update medicine ──────────────────────────────────────────────────────────
const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!medicine) return sendError(res, 404, "Medicine not found.");
    return sendSuccess(res, 200, "Medicine updated.", medicine);
  } catch (err) {
    next(err);
  }
};

// ─── Delete medicine ──────────────────────────────────────────────────────────
const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!medicine) return sendError(res, 404, "Medicine not found.");
    return sendSuccess(res, 200, "Medicine deleted.");
  } catch (err) {
    next(err);
  }
};

// ─── Mark medicine dose as taken/missed ───────────────────────────────────────
const updateMedicineStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["active", "paused", "completed", "discontinued"];

    if (!validStatuses.includes(status)) {
      return sendError(res, 400, `Status must be one of: ${validStatuses.join(", ")}`);
    }

    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { status } },
      { new: true }
    );

    if (!medicine) return sendError(res, 404, "Medicine not found.");
    return sendSuccess(res, 200, "Medicine status updated.", medicine);
  } catch (err) {
    next(err);
  }
};

// ─── Get today's schedule ─────────────────────────────────────────────────────
const getTodaySchedule = async (req, res, next) => {
  try {
    const medicines = await Medicine.find({
      userId: req.user._id,
      status: "active",
      startDate: { $lte: new Date() },
      $or: [{ endDate: { $gte: new Date() } }, { endDate: null }],
    }).select("name dosage timings frequency notes prescribedBy");

    return sendSuccess(res, 200, "Today's medicine schedule.", medicines);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateMedicineStatus,
  getTodaySchedule,
};
