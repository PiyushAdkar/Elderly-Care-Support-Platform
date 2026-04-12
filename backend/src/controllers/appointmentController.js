const Appointment = require("../models/Appointment");
const Contact = require("../models/Contact");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── Static doctor listing (replace with a real Doctor model if needed) ───────
const MOCK_DOCTORS = [
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d1",
    name: "Dr. Ananya Mehta",
    specialization: "Geriatrics",
    hospital: "Deenanath Mangeshkar Hospital, Pune",
    phone: "+91-2024441234",
    availableHours: "Mon-Sat, 9AM-1PM",
    consultationFee: 600,
    rating: 4.8,
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d2",
    name: "Dr. Rajesh Kulkarni",
    specialization: "Cardiology",
    hospital: "Ruby Hall Clinic, Pune",
    phone: "+91-2024445678",
    availableHours: "Mon-Fri, 2PM-6PM",
    consultationFee: 900,
    rating: 4.9,
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d3",
    name: "Dr. Sunita Verma",
    specialization: "Neurology",
    hospital: "Jehangir Hospital, Pune",
    phone: "+91-2024449012",
    availableHours: "Tue-Sat, 10AM-4PM",
    consultationFee: 800,
    rating: 4.7,
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d4",
    name: "Dr. Pradeep Shah",
    specialization: "Orthopedics",
    hospital: "Sahyadri Hospital, Pune",
    phone: "+91-2024443456",
    availableHours: "Mon-Wed-Fri, 8AM-12PM",
    consultationFee: 700,
    rating: 4.6,
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d5",
    name: "Dr. Kavita Desai",
    specialization: "General Physician",
    hospital: "KEM Hospital, Pune",
    phone: "+91-2024447890",
    availableHours: "Mon-Sat, 10AM-6PM",
    consultationFee: 400,
    rating: 4.5,
  },
];

// ─── List doctors ─────────────────────────────────────────────────────────────
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query;
    let doctors = MOCK_DOCTORS;

    if (specialization) {
      doctors = doctors.filter((d) =>
        d.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    if (search) {
      doctors = doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.hospital.toLowerCase().includes(search.toLowerCase())
      );
    }

    return sendSuccess(res, 200, "Doctors fetched.", doctors);
  } catch (err) {
    next(err);
  }
};

// ─── Get all appointments ─────────────────────────────────────────────────────
const getAppointments = async (req, res, next) => {
  try {
    const { status, upcoming } = req.query;
    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
      filter.status = { $in: ["scheduled", "rescheduled"] };
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: upcoming === "true" ? 1 : -1 })
      .populate("doctorId", "name phone email specialization");

    return sendSuccess(res, 200, "Appointments fetched.", appointments);
  } catch (err) {
    next(err);
  }
};

// ─── Get single appointment ───────────────────────────────────────────────────
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("doctorId", "name phone email specialization");

    if (!appointment) return sendError(res, 404, "Appointment not found.");
    return sendSuccess(res, 200, "Appointment fetched.", appointment);
  } catch (err) {
    next(err);
  }
};

// ─── Book appointment ─────────────────────────────────────────────────────────
const bookAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: req.user._id,
    });

    return sendSuccess(res, 201, "Appointment booked.", appointment);
  } catch (err) {
    next(err);
  }
};

// ─── Update appointment ───────────────────────────────────────────────────────
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!appointment) return sendError(res, 404, "Appointment not found.");
    return sendSuccess(res, 200, "Appointment updated.", appointment);
  } catch (err) {
    next(err);
  }
};

// ─── Cancel appointment ───────────────────────────────────────────────────────
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { status: "cancelled" } },
      { new: true }
    );

    if (!appointment) return sendError(res, 404, "Appointment not found.");
    return sendSuccess(res, 200, "Appointment cancelled.", appointment);
  } catch (err) {
    next(err);
  }
};

// ─── Share report with doctor ─────────────────────────────────────────────────
const shareReport = async (req, res, next) => {
  try {
    const { appointmentId, documentId, doctorEmail } = req.body;

    // In production: send an email/notification with the secure document URL.
    // Here we simulate a success response.
    return sendSuccess(res, 200, "Report shared with doctor successfully.", {
      appointmentId,
      documentId,
      sharedWith: doctorEmail,
      sharedAt: new Date(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDoctors,
  getAppointments,
  getAppointment,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  shareReport,
};
