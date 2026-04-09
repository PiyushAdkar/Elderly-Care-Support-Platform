const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * Intent map: keyword arrays → action descriptors.
 * Extend this with NLP / LLM integration in production.
 */
const INTENT_MAP = [
  {
    action: "TRIGGER_SOS",
    keywords: ["sos", "help me", "emergency", "call for help", "danger", "fallen", "i fell"],
    description: "Trigger an SOS emergency alert",
    route: "POST /api/sos",
  },
  {
    action: "GET_MEDICINES",
    keywords: ["medicine", "medicines", "pills", "tablet", "medication", "drugs", "dosage"],
    description: "View medicine list or schedule",
    route: "GET /api/medicines",
  },
  {
    action: "GET_TODAY_SCHEDULE",
    keywords: ["today's schedule", "today schedule", "remind me", "my schedule", "what do i take"],
    description: "Get today's medicine schedule",
    route: "GET /api/medicines/today",
  },
  {
    action: "BOOK_APPOINTMENT",
    keywords: ["book appointment", "doctor appointment", "schedule visit", "see a doctor", "consult"],
    description: "Book a doctor appointment",
    route: "POST /api/appointments",
  },
  {
    action: "GET_APPOINTMENTS",
    keywords: ["appointment", "appointments", "upcoming visit", "when is my doctor"],
    description: "View upcoming appointments",
    route: "GET /api/appointments",
  },
  {
    action: "GET_DOCTORS",
    keywords: ["find doctor", "list doctors", "available doctors", "who is available", "specialist"],
    description: "Browse available doctors",
    route: "GET /api/doctors",
  },
  {
    action: "LOG_ACTIVITY",
    keywords: ["steps", "walked", "exercise", "activity", "i walked", "my steps", "calories"],
    description: "Log daily activity",
    route: "POST /api/activity",
  },
  {
    action: "GET_ACTIVITY",
    keywords: ["my activity", "how much did i walk", "weekly summary", "health summary"],
    description: "View activity summary",
    route: "GET /api/activity/summary/weekly",
  },
  {
    action: "GET_CONTACTS",
    keywords: ["contacts", "family contacts", "call someone", "who should i call", "my family"],
    description: "View saved contacts",
    route: "GET /api/contacts",
  },
  {
    action: "UPLOAD_DOCUMENT",
    keywords: ["upload report", "save report", "store document", "upload prescription", "my reports"],
    description: "Upload a health document",
    route: "POST /api/documents",
  },
  {
    action: "GET_DOCUMENTS",
    keywords: ["my documents", "my reports", "prescriptions", "lab results", "show files"],
    description: "View uploaded documents",
    route: "GET /api/documents",
  },
  {
    action: "PLAY_MUSIC",
    keywords: ["play music", "music", "song", "bhajan", "classical", "devotional", "play something"],
    description: "Browse music categories",
    route: "GET /api/entertainment/music",
  },
  {
    action: "PLAY_STORY",
    keywords: ["story", "stories", "tell me a story", "panchatantra", "ramayana", "read to me"],
    description: "Browse story categories",
    route: "GET /api/entertainment/stories",
  },
  {
    action: "UNKNOWN",
    keywords: [],
    description: "Command not recognized",
    route: null,
  },
];

/**
 * Score a command text against an intent's keyword list.
 */
const scoreIntent = (text, intent) => {
  let score = 0;
  const lower = text.toLowerCase();
  for (const kw of intent.keywords) {
    if (lower.includes(kw)) {
      // Longer keyword matches score higher
      score += kw.split(" ").length;
    }
  }
  return score;
};

// ─── Process voice command text ───────────────────────────────────────────────
const processVoiceCommand = (req, res, next) => {
  try {
    const { command } = req.body;

    if (!command || typeof command !== "string" || !command.trim()) {
      return sendError(res, 400, "A non-empty 'command' string is required.");
    }

    const trimmed = command.trim();

    // Score all intents (skip UNKNOWN)
    const scored = INTENT_MAP.filter((i) => i.action !== "UNKNOWN").map((intent) => ({
      intent,
      score: scoreIntent(trimmed, intent),
    }));

    const best = scored.reduce((a, b) => (b.score > a.score ? b : a), { score: 0, intent: null });

    const matched = best.score > 0 ? best.intent : INTENT_MAP.find((i) => i.action === "UNKNOWN");

    return sendSuccess(res, 200, "Voice command processed.", {
      originalCommand: trimmed,
      action: matched.action,
      description: matched.description,
      suggestedRoute: matched.route,
      confidence: best.score > 0 ? Math.min(100, best.score * 20) : 0,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { processVoiceCommand };
