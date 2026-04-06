const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileKey: { type: String, trim: true },       // S3 key or storage provider reference
    mimeType: { type: String, trim: true },       // e.g. "application/pdf", "image/jpeg"
    sizeBytes: { type: Number, min: 0 },
    type: {
      type: String,
      required: true,
      enum: [
        "prescription",
        "lab_report",
        "discharge_summary",
        "insurance",
        "id_proof",
        "scan",
        "other",
      ],
    },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",          // Could be the elder themselves or their caretaker
    },
    relatedAppointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    isArchived: { type: Boolean, default: false },
    tags: { type: [String], default: [] },        // free-form search tags
  },
  { timestamps: true }
);

// --- Indexes ---
documentSchema.index({ userId: 1, type: 1 });
documentSchema.index({ userId: 1, uploadedAt: -1 });
documentSchema.index({ userId: 1, isArchived: 1 });
documentSchema.index({ tags: 1 });

// --- Sample Document ---
/*
{
  "_id": "64f6f7a8b9c0d6e7f8a9b0c1",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Blood Test Report - Sep 2024",
  "fileUrl": "https://s3.amazonaws.com/elder-companion/docs/blood-test-sep2024.pdf",
  "fileKey": "docs/blood-test-sep2024.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245760,
  "type": "lab_report",
  "uploadedAt": "2024-09-20T14:00:00.000Z",
  "uploadedBy": "64f1a2b3c4d5e6f7a8b9c0d1",
  "relatedAppointmentId": "64f4d5e6f7a8b9c0d4e5f6a7",
  "isArchived": false,
  "tags": ["blood", "diabetes", "HbA1c"],
  "createdAt": "2024-09-20T14:00:00.000Z",
  "updatedAt": "2024-09-20T14:00:00.000Z"
}
*/

module.exports = mongoose.model("Document", documentSchema);
