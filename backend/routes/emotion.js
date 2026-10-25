const express = require("express");
const router = express.Router();

let currentEmotion = {
  state: "Motivated",
  emoji: "🔥",
  stressPercent: 15,
  advice: "⚡ Focus levels optimal. System prime for deep engineering work.",
  themeGlow: "#00f3ff"
};

router.get("/", (req, res) => {
  res.json(currentEmotion);
});

router.post("/analyze", (req, res) => {
  const { message, level } = req.body;
  const lower = (message || "").toLowerCase();

  if (lower.includes("stressed") || lower.includes("overwhelmed") || lower.includes("deadline")) {
    currentEmotion = {
      state: "Stressed",
      emoji: "😰",
      stressPercent: Math.min(100, (level || 75)),
      advice: "🧘 Stress spike detected. I suggest 5 minutes of mindful breathwork and breaking down task #1.",
      themeGlow: "#ff5500"
    };
  } else if (lower.includes("sad") || lower.includes("down") || lower.includes("tired")) {
    currentEmotion = {
      state: "Sad",
      emoji: "💙",
      stressPercent: 40,
      advice: "💙 I am here for you, Commander. Remember why you started this journey.",
      themeGlow: "#0088ff"
    };
  } else if (lower.includes("angry") || lower.includes("frustrated") || lower.includes("bug")) {
    currentEmotion = {
      state: "Angry",
      emoji: "🤬",
      stressPercent: 85,
      advice: "🔥 Step away from the terminal for 2 minutes. Let me inspect the traceback log.",
      themeGlow: "#ff0044"
    };
  } else if (lower.includes("happy") || lower.includes("excited") || lower.includes("success") || lower.includes("great")) {
    currentEmotion = {
      state: "Excited",
      emoji: "🚀",
      stressPercent: 5,
      advice: "🌟 Outstanding progress! Dynamic momentum active across all project modules.",
      themeGlow: "#00ffaa"
    };
  } else {
    currentEmotion = {
      state: "Motivated",
      emoji: "🔥",
      stressPercent: 15,
      advice: "⚡ Systems operating at peak performance.",
      themeGlow: "#00f3ff"
    };
  }

  res.json(currentEmotion);
});

module.exports = router;
