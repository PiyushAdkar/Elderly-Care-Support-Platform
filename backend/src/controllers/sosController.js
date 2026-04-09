const SosLog = require("../models/SosLog");
const Contact = require("../models/Contact");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const logger = require("../utils/logger");

/**
 * Simulates sending an alert (SMS / push notification).
 * Replace this with a real provider (Twilio, FCM, etc.) in production.
 */
const dispatchAlert = async (contact, user, location) => {
  logger.info(
    `[SOS ALERT] → ${contact.name} (${contact.phone}): ` +
      `${user.name} triggered SOS at ${location.address || JSON.stringify(location.coordinates)}`
  );
  // TODO: integrate Twilio / SNS / FCM here
  return { contactName: contact.name, phone: contact.phone, notifiedAt: new Date() };
};

// ─── Trigger SOS ──────────────────────────────────────────────────────────────
const triggerSOS = async (req, res, next) => {
  try {
    const { coordinates, address, accuracy, triggerType, deviceInfo } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return sendError(res, 400, "Location coordinates [longitude, latitude] are required.");
    }

    // Fetch all contacts to notify
    const contacts = await Contact.find({ userId: req.user._id }).lean();
    const elderContacts = contacts.filter((c) =>
      ["family", "doctor", "caretaker"].includes(c.type)
    );

    // Also include embedded emergency contacts from User document
    const allToNotify = [
      ...elderContacts,
      ...req.user.emergencyContacts.map((ec) => ({ name: ec.name, phone: ec.phone })),
    ];

    // Dispatch alerts concurrently
    const notifiedContacts = await Promise.all(
      allToNotify.map((c) =>
        dispatchAlert(c, req.user, { coordinates, address }).catch(() => null)
      )
    );

    const sosLog = await SosLog.create({
      userId: req.user._id,
      timestamp: new Date(),
      location: {
        type: "Point",
        coordinates,
        address: address || "",
        accuracy: accuracy || null,
      },
      triggerType: triggerType || "manual",
      status: "triggered",
      notifiedContacts: notifiedContacts.filter(Boolean),
      deviceInfo: deviceInfo || "",
    });

    return sendSuccess(res, 201, "SOS triggered. Emergency contacts have been notified.", {
      sosId: sosLog._id,
      notifiedCount: notifiedContacts.filter(Boolean).length,
      timestamp: sosLog.timestamp,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get SOS history ──────────────────────────────────────────────────────────
const getSosHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);

    const [logs, total] = await Promise.all([
      SosLog.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("resolvedBy", "name phone"),
      SosLog.countDocuments({ userId: req.user._id }),
    ]);

    return sendSuccess(res, 200, "SOS history fetched.", logs, {
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// ─── Resolve / acknowledge SOS ────────────────────────────────────────────────
const resolveSOS = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ["acknowledged", "resolved", "false_alarm"];

    if (!validStatuses.includes(status)) {
      return sendError(res, 400, `Status must be one of: ${validStatuses.join(", ")}`);
    }

    const log = await SosLog.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          resolvedAt: new Date(),
          resolvedBy: req.user._id,
          notes: notes || "",
        },
      },
      { new: true }
    );

    if (!log) return sendError(res, 404, "SOS log not found.");
    return sendSuccess(res, 200, "SOS status updated.", log);
  } catch (err) {
    next(err);
  }
};

module.exports = { triggerSOS, getSosHistory, resolveSOS };
