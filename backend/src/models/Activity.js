const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true },
    steps: { type: Number, default: 0, min: 0 },
    distanceKm: { type: Number, default: 0, min: 0 },
    activeMinutes: { type: Number, default: 0, min: 0 },
    caloriesBurned: { type: Number, default: 0, min: 0 },
    heartRateAvg: { type: Number, min: 0 },     // bpm
    sleepHours: { type: Number, min: 0, max: 24 },
    waterIntakeLiters: { type: Number, min: 0 },
    moodScore: {
      type: Number,
      min: 1,
      max: 5,
      // 1 = very low, 5 = very good
    },
    notes: { type: String, trim: true },
    source: {
      type: String,
      enum: ["manual", "wearable", "phone", "caretaker"],
      default: "manual",
    },
  },
  { timestamps: true }
);

// --- Compound index: one activity record per user per day ---
activitySchema.index({ userId: 1, date: 1 }, { unique: true });
activitySchema.index({ date: 1 });

// --- Sample Document ---
/*
{
  "_id": "64f5e6f7a8b9c0d5e6f7a8b9",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "date": "2024-09-28T00:00:00.000Z",
  "steps": 4200,
  "distanceKm": 3.1,
  "activeMinutes": 45,
  "caloriesBurned": 210,
  "heartRateAvg": 72,
  "sleepHours": 7.5,
  "waterIntakeLiters": 1.8,
  "moodScore": 4,
  "notes": "Took a morning walk in the park",
  "source": "wearable",
  "createdAt": "2024-09-28T20:00:00.000Z",
  "updatedAt": "2024-09-28T22:00:00.000Z"
}
*/

module.exports = mongoose.model("Activity", activitySchema);
