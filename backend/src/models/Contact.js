const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },  // e.g. "Son", "Cardiologist"
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    type: {
      type: String,
      required: true,
      enum: ["family", "doctor", "caretaker", "neighbor", "other"],
    },
    specialization: { type: String, trim: true },  // relevant when type is "doctor"
    isPrimary: { type: Boolean, default: false },
    availableHours: { type: String, trim: true },  // e.g. "Mon-Fri, 9AM-5PM"
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// --- Indexes ---
contactSchema.index({ userId: 1, type: 1 });
contactSchema.index({ userId: 1, isPrimary: 1 });

// --- Sample Document ---
/*
{
  "_id": "64f3c4d5e6f7a8b9c0d3e4f5",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Dr. Priya Sharma",
  "relation": "Family Doctor",
  "phone": "+91-9988776655",
  "email": "priya.sharma@clinic.com",
  "type": "doctor",
  "specialization": "General Physician",
  "isPrimary": true,
  "availableHours": "Mon-Sat, 10AM-6PM",
  "notes": "Prefers appointment via phone call",
  "createdAt": "2024-09-01T08:00:00.000Z",
  "updatedAt": "2024-09-01T08:00:00.000Z"
}
*/

module.exports = mongoose.model("Contact", contactSchema);
