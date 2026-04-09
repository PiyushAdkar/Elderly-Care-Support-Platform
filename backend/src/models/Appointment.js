const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctorName: { type: String, required: true, trim: true },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },   // e.g. "10:30 AM"
    location: { type: String, trim: true },   // clinic/hospital address or "Online"
    purpose: { type: String, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "completed", "cancelled", "missed", "rescheduled"],
      default: "scheduled",
    },
    reminderSent: { type: Boolean, default: false },
    notes: { type: String, trim: true },      // post-appointment notes
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

// --- Indexes ---
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ userId: 1, date: 1 });
appointmentSchema.index({ date: 1 });           // global upcoming appointments query

// --- Sample Document ---
/*
{
  "_id": "64f4d5e6f7a8b9c0d4e5f6a7",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "doctorName": "Dr. Priya Sharma",
  "doctorId": "64f3c4d5e6f7a8b9c0d3e4f5",
  "date": "2024-10-05T00:00:00.000Z",
  "time": "11:00 AM",
  "location": "HealthFirst Clinic, Pune - 411001",
  "purpose": "Routine diabetes check-up",
  "status": "scheduled",
  "reminderSent": false,
  "notes": "",
  "followUpDate": "2024-11-05T00:00:00.000Z",
  "createdAt": "2024-09-25T08:00:00.000Z",
  "updatedAt": "2024-09-25T08:00:00.000Z"
}
*/

module.exports = mongoose.model("Appointment", appointmentSchema);
