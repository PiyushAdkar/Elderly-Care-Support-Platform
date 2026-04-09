require("dotenv").config();
const fs = require("fs");

const app = require("./app.js");
const connectDB = require("./config/db.js");
const logger = require("./utils/logger.js");

// ── Ensure required directories exist ─────────────────────────────────────────
["logs", process.env.UPLOAD_DIR || "uploads"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const PORT = parseInt(process.env.PORT || "5000", 10);

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.error(`Database connection failed on startup. Server is running in degraded mode.`);
  }

  const server = app.listen(PORT, () => {
    logger.info(`──────────────────────────────────────────────`);
    logger.info(` Elder Companion API`);
    logger.info(` Environment : ${process.env.NODE_ENV || "development"}`);
    logger.info(` Port        : ${PORT}`);
    logger.info(` Base URL    : ${process.env.APP_BASE_URL || `http://localhost:${PORT}`}`);
    logger.info(`──────────────────────────────────────────────`);
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.warn(`${signal} received. Shutting down gracefully...`);
    if (server) {
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
    // Force kill after 10 s
    setTimeout(() => {
      logger.error("Forced shutdown after timeout.");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    shutdown("uncaughtException");
  });
};

start();
