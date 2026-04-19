const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const logger = require("./utils/logger");
const { errorHandler } = require("./utils/errorHandler");
const { sendError } = require("./utils/apiResponse");

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes          = require("./routes/authRoutes");
const medicineRoutes      = require("./routes/medicineRoutes");
const sosRoutes           = require("./routes/sosRoutes");
const contactRoutes       = require("./routes/contactRoutes");
const appointmentRoutes   = require("./routes/appointmentRoutes");
const activityRoutes      = require("./routes/activityRoutes");
const documentRoutes      = require("./routes/documentRoutes");
const entertainmentRoutes = require("./routes/entertainmentRoutes");
const voiceRoutes         = require("./routes/voiceRoutes");

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    // TODO: Change this origin to your specific Vercel domain once the frontend is live for better security
    // e.g., origin: 'https://my-elder-companion-frontend.vercel.app'
    origin: '*',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 min
  max: process.env.NODE_ENV === 'development' ? 1000 : parseInt(process.env.RATE_LIMIT_MAX || "100"), // Relaxed for development
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => sendError(res, 429, "Too many requests. Please try again later."),
});
app.use("/api/", limiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 20,
  handler: (_req, res) => sendError(res, 429, "Too many login attempts. Please try again later."),
});
app.use("/api/auth/login",  authLimiter);
app.use("/api/auth/signup", authLimiter);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
    skip: (_req, res) => res.statusCode < 400,          // only log errors in prod
  })
);
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));                               // pretty logging in dev
}

// ── Static file serving (uploaded documents) ──────────────────────────────────
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.resolve(uploadDir)));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Elder Companion API is running.",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/medicines",     medicineRoutes);
app.use("/api/sos",           sosRoutes);
app.use("/api/contacts",      contactRoutes);
app.use("/api/appointments",  appointmentRoutes);
app.use("/api/doctors",       (req, res, next) => {          // alias for /api/appointments/doctors
  req.url = "/doctors" + req.url;
  appointmentRoutes(req, res, next);
});
app.use("/api/activities",    activityRoutes);
app.use("/api/documents",     documentRoutes);
app.use("/api/entertainment", entertainmentRoutes);
app.use("/api/voice-command", voiceRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  sendError(res, 404, "Route not found.");
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
