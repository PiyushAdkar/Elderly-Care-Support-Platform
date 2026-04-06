const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],   // [longitude, latitude]
      required: true,
    },
    address: { type: String, trim: true },
    accuracy: { type: Number },    // GPS accuracy in meters
  },
  { _id: false }
);

const sosLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    timestamp: { type: Date, required: true, default: Date.now },
    location: { type: locationSchema, required: true },
    triggerType: {
      type: String,
      enum: ["manual", "fall_detected", "heart_rate_alert", "inactivity", "geofence_breach"],
      default: "manual",
    },
    status: {
      type: String,
      enum: ["triggered", "acknowledged", "resolved", "false_alarm"],
      default: "triggered",
    },
    resolvedAt: { type: Date },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      // The caretaker or responder who resolved it
      default: null,
    },
    notifiedContacts: [
      {
        contactName: { type: String },
        phone: { type: String },
        notifiedAt: { type: Date },
        _id: false,
      },
    ],
    notes: { type: String, trim: true },
    deviceInfo: { type: String, trim: true },  // e.g. "Android 13 - Samsung A52"
  },
  { timestamps: true }
);

// --- Geo index for location-based queries ---
sosLogSchema.index({ location: "2dsphere" });
// --- Query by user + time ---
sosLogSchema.index({ userId: 1, timestamp: -1 });
// --- Query active (unresolved) SOS events ---
sosLogSchema.index({ status: 1, timestamp: -1 });

// --- Sample Document ---
/*
{
  "_id": "64f7a8b9c0d7e8f9a0b1c2d3",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "timestamp": "2024-09-28T06:45:00.000Z",
  "location": {
    "type": "Point",
    "coordinates": [73.8567, 18.5204],
    "address": "FC Road, Pune, Maharashtra 411004",
    "accuracy": 10
  },
  "triggerType": "fall_detected",
  "status": "resolved",
  "resolvedAt": "2024-09-28T07:05:00.000Z",
  "resolvedBy": "64f1a2b3c4d5e6f7a8b9c0d9",
  "notifiedContacts": [
    { "contactName": "James Thompson", "phone": "+91-9123456789", "notifiedAt": "2024-09-28T06:45:05.000Z" },
    { "contactName": "Dr. Priya Sharma", "phone": "+91-9988776655", "notifiedAt": "2024-09-28T06:45:08.000Z" }
  ],
  "notes": "Elder slipped in the bathroom. Caretaker arrived in 20 mins. No serious injury.",
  "deviceInfo": "Android 13 - Samsung A52",
  "createdAt": "2024-09-28T06:45:00.000Z",
  "updatedAt": "2024-09-28T07:05:00.000Z"
}
*/

module.exports = mongoose.model("SosLog", sosLogSchema);
