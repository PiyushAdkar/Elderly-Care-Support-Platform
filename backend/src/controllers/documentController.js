const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── Upload a document ────────────────────────────────────────────────────────
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "No file uploaded. Please attach a file.");
    }

    const { title, type, relatedAppointmentId, tags } = req.body;
    const baseUrl = process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    const document = await Document.create({
      userId: req.user._id,
      uploadedBy: req.user._id,
      title: title || req.file.originalname,
      fileUrl: `${baseUrl}/uploads/${req.file.filename}`,
      fileKey: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      type: type || "other",
      relatedAppointmentId: relatedAppointmentId || null,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
    });

    return sendSuccess(res, 201, "Document uploaded.", document);
  } catch (err) {
    next(err);
  }
};

// ─── Get all documents ────────────────────────────────────────────────────────
const getDocuments = async (req, res, next) => {
  try {
    const { type, isArchived, search, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };

    if (type) filter.type = type;
    filter.isArchived = isArchived === "true";

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));

    const [documents, total] = await Promise.all([
      Document.find(filter)
        .sort({ uploadedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("uploadedBy", "name role")
        .populate("relatedAppointmentId", "doctorName date time"),
      Document.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Documents fetched.", documents, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get single document ──────────────────────────────────────────────────────
const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("uploadedBy", "name role")
      .populate("relatedAppointmentId", "doctorName date time");

    if (!document) return sendError(res, 404, "Document not found.");
    return sendSuccess(res, 200, "Document fetched.", document);
  } catch (err) {
    next(err);
  }
};

// ─── Download / stream document ───────────────────────────────────────────────
const downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) return sendError(res, 404, "Document not found.");

    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const filePath = path.resolve(uploadDir, document.fileKey);

    if (!fs.existsSync(filePath)) {
      return sendError(res, 404, "Physical file not found on server.");
    }

    res.setHeader("Content-Disposition", `attachment; filename="${document.title}"`);
    res.setHeader("Content-Type", document.mimeType || "application/octet-stream");
    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};

// ─── Update document metadata ──────────────────────────────────────────────────
const updateDocument = async (req, res, next) => {
  try {
    const allowedFields = ["title", "type", "tags", "isArchived", "relatedAppointmentId"];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!document) return sendError(res, 404, "Document not found.");
    return sendSuccess(res, 200, "Document updated.", document);
  } catch (err) {
    next(err);
  }
};

// ─── Delete document ──────────────────────────────────────────────────────────
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) return sendError(res, 404, "Document not found.");

    // Remove physical file
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const filePath = path.resolve(uploadDir, document.fileKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return sendSuccess(res, 200, "Document deleted.");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
};
