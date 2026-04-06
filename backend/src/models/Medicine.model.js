const mongoose = require("mongoose");

const timingSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },        // e.g. "08:00 AM"
    mealRelation: {
      type: String,
      enum: ["before_meal", "after_meal", "with_meal", "anytime"],
      default: "anytime",
    },
  },
  { _id: false }
);

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },  // e.g. "500mg", "1 tablet"
    timings: { type: [timingSchema], required: true },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "as_needed"],
      default: "daily",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "discontinued"],
      default: "active",
    },
    notes: { type: String, trim: true },
    prescribedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

// --- Indexes ---
medicineSchema.index({ userId: 1, status: 1 });
medicineSchema.index({ userId: 1, name: 1 });

// --- Sample Document ---
/*
{
  "_id": "64f2b3c4d5e6f7a8b9c0d2e3",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Metformin",
  "dosage": "500mg",
  "timings": [
    { "time": "08:00 AM", "mealRelation": "after_meal" },
    { "time": "08:00 PM", "mealRelation": "after_meal" }
  ],
  "frequency": "daily",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "status": "active",
  "notes": "Take with a full glass of water",
  "prescribedBy": "Dr. Priya Sharma",
  "createdAt": "2024-09-01T08:00:00.000Z",
  "updatedAt": "2024-09-01T08:00:00.000Z"
}
*/

module.exports = mongoose.model("Medicine", medicineSchema);
