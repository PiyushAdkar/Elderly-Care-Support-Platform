const Activity = require("../models/Activity");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── Log or upsert today's activity ──────────────────────────────────────────
const logActivity = async (req, res, next) => {
  try {
    const { date, steps, distanceKm, activeMinutes, caloriesBurned,
            heartRateAvg, sleepHours, waterIntakeLiters, moodScore, notes, source } = req.body;

    // Normalize to midnight UTC so uniqueness works correctly
    const activityDate = date ? new Date(date) : new Date();
    activityDate.setUTCHours(0, 0, 0, 0);

    const activity = await Activity.findOneAndUpdate(
      { userId: req.user._id, date: activityDate },
      {
        $set: {
          steps, distanceKm, activeMinutes, caloriesBurned,
          heartRateAvg, sleepHours, waterIntakeLiters, moodScore, notes,
          source: source || "manual",
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return sendSuccess(res, 200, "Activity logged.", activity);
  } catch (err) {
    next(err);
  }
};

// ─── Get activity list (paginated, filterable by date range) ──────────────────
const getActivities = async (req, res, next) => {
  try {
    const { from, to, page = 1, limit = 30 } = req.query;
    const filter = { userId: req.user._id };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(90, parseInt(limit));

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .sort({ date: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Activity.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Activities fetched.", activities, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get today's activity ──────────────────────────────────────────────────────
const getTodayActivity = async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const activity = await Activity.findOne({ userId: req.user._id, date: today });
    if (!activity) return sendError(res, 404, "No activity logged for today yet.");

    return sendSuccess(res, 200, "Today's activity.", activity);
  } catch (err) {
    next(err);
  }
};

// ─── Weekly summary ───────────────────────────────────────────────────────────
const getWeeklySummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const records = await Activity.find({
      userId: req.user._id,
      date: { $gte: weekAgo, $lte: today },
    }).sort({ date: 1 });

    if (!records.length) {
      return sendSuccess(res, 200, "No activity data for this week.", { records: [], summary: {} });
    }

    const summary = {
      totalSteps:         records.reduce((s, r) => s + (r.steps || 0), 0),
      totalDistanceKm:    +records.reduce((s, r) => s + (r.distanceKm || 0), 0).toFixed(2),
      totalActiveMinutes: records.reduce((s, r) => s + (r.activeMinutes || 0), 0),
      totalCalories:      records.reduce((s, r) => s + (r.caloriesBurned || 0), 0),
      avgHeartRate:       +(records.filter(r => r.heartRateAvg)
                            .reduce((s, r, _, a) => s + r.heartRateAvg / a.length, 0)).toFixed(1),
      avgSleepHours:      +(records.filter(r => r.sleepHours)
                            .reduce((s, r, _, a) => s + r.sleepHours / a.length, 0)).toFixed(1),
      avgMoodScore:       +(records.filter(r => r.moodScore)
                            .reduce((s, r, _, a) => s + r.moodScore / a.length, 0)).toFixed(1),
      daysLogged:         records.length,
    };

    return sendSuccess(res, 200, "Weekly summary.", { records, summary });
  } catch (err) {
    next(err);
  }
};

module.exports = { logActivity, getActivities, getTodayActivity, getWeeklySummary };
