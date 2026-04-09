const { sendSuccess } = require("../utils/apiResponse");

const MUSIC_CATEGORIES = [
  {
    id: "mc_01",
    name: "Classical Indian",
    description: "Soothing ragas and classical compositions for relaxation.",
    mood: ["calm", "relaxing"],
    tracks: [
      { title: "Raga Bhairav", artist: "Pt. Bhimsen Joshi", duration: "12:34", url: "#" },
      { title: "Raga Yaman",   artist: "Ustad Rashid Khan",  duration: "18:20", url: "#" },
    ],
  },
  {
    id: "mc_02",
    name: "Devotional & Bhajans",
    description: "Uplifting bhajans and devotional songs.",
    mood: ["spiritual", "peaceful"],
    tracks: [
      { title: "Om Namah Shivaya", artist: "Anuradha Paudwal", duration: "8:10",  url: "#" },
      { title: "Hanuman Chalisa",  artist: "Hariharan",         duration: "7:45",  url: "#" },
    ],
  },
  {
    id: "mc_03",
    name: "Old Hindi Melodies",
    description: "Golden era Bollywood songs from the 50s–80s.",
    mood: ["nostalgic", "happy"],
    tracks: [
      { title: "Lag Ja Gale",   artist: "Lata Mangeshkar", duration: "4:30", url: "#" },
      { title: "Aaj Phir Jeene Ki",  artist: "Lata Mangeshkar", duration: "5:12", url: "#" },
    ],
  },
  {
    id: "mc_04",
    name: "Nature Sounds & Meditation",
    description: "Ambient nature sounds for sleep and meditation.",
    mood: ["sleepy", "meditative"],
    tracks: [
      { title: "Rainforest Morning", artist: "Nature Sounds", duration: "30:00", url: "#" },
      { title: "Ocean Waves",        artist: "Nature Sounds", duration: "25:00", url: "#" },
    ],
  },
];

const STORY_CATEGORIES = [
  {
    id: "sc_01",
    name: "Panchatantra Tales",
    description: "Classic Indian fables with moral lessons.",
    language: ["Hindi", "English"],
    stories: [
      { title: "The Monkey and the Crocodile", duration: "8 min",  url: "#" },
      { title: "The Blue Jackal",              duration: "6 min",  url: "#" },
    ],
  },
  {
    id: "sc_02",
    name: "Ramayana & Mahabharata Episodes",
    description: "Short episodes from the great Indian epics.",
    language: ["Hindi", "English", "Sanskrit"],
    stories: [
      { title: "Hanuman Meets Sita",      duration: "12 min", url: "#" },
      { title: "The Bhagavad Gita — Ch 1", duration: "15 min", url: "#" },
    ],
  },
  {
    id: "sc_03",
    name: "Comedy & Laughter",
    description: "Funny short stories and Tenali Raman jokes.",
    language: ["Hindi", "English"],
    stories: [
      { title: "Tenali Raman and the Cats",   duration: "7 min", url: "#" },
      { title: "Akbar and Birbal — The Fool", duration: "5 min", url: "#" },
    ],
  },
  {
    id: "sc_04",
    name: "Motivational Stories",
    description: "Short inspirational stories for elders.",
    language: ["Hindi", "English"],
    stories: [
      { title: "The Old Man and the Mountain", duration: "10 min", url: "#" },
      { title: "Never Too Late",               duration: "8 min",  url: "#" },
    ],
  },
];

// ─── Get music categories ─────────────────────────────────────────────────────
const getMusicCategories = (req, res) => {
  const { mood } = req.query;
  let result = MUSIC_CATEGORIES;
  if (mood) {
    result = result.filter((c) => c.mood.includes(mood.toLowerCase()));
  }
  return sendSuccess(res, 200, "Music categories fetched.", result);
};

// ─── Get story categories ─────────────────────────────────────────────────────
const getStoryCategories = (req, res) => {
  const { language } = req.query;
  let result = STORY_CATEGORIES;
  if (language) {
    result = result.filter((c) =>
      c.language.map((l) => l.toLowerCase()).includes(language.toLowerCase())
    );
  }
  return sendSuccess(res, 200, "Story categories fetched.", result);
};

// ─── Get all entertainment ────────────────────────────────────────────────────
const getEntertainment = (req, res) => {
  return sendSuccess(res, 200, "Entertainment content fetched.", {
    music: MUSIC_CATEGORIES,
    stories: STORY_CATEGORIES,
  });
};

module.exports = { getMusicCategories, getStoryCategories, getEntertainment };
