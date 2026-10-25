const express = require("express");
const router = express.Router();
const userConfig = require("../config/userConfig.json");
const db = require("../database/init");

// Login Endpoint
router.post("/login", (req, res) => {
  const { username, password, rememberMe } = req.body;

  if (username === userConfig.username && password === userConfig.password) {
    // Log login activity
    db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
      "LOGIN",
      `Commander ${userConfig.name} logged into PHANTOM OS`
    ]);

    return res.json({
      success: true,
      user: {
        username: userConfig.username,
        name: userConfig.name,
        role: userConfig.role
      },
      token: rememberMe ? userConfig.rememberToken : "session_token_v2",
      redirect: "/pages/boot.html"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Security Protocol Warning: Invalid Credentials."
  });
});

// User profile Endpoint
router.get("/profile", (req, res) => {
  // Fetch skills and interests from memory table
  db.all("SELECT * FROM memory WHERE key_type IN ('skill', 'interest', 'goal', 'roadmap')", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const skills = rows.filter(r => r.key_type === 'skill').map(r => r.content).join(", ");
    const interests = rows.filter(r => r.key_type === 'interest').map(r => r.content).join(", ");
    const goalRow = rows.find(r => r.key_type === 'goal');
    const roadmapRow = rows.find(r => r.key_type === 'roadmap');

    res.json({
      username: userConfig.username,
      name: userConfig.name,
      role: userConfig.role,
      skills: skills || "Java, Node.js, Python, HTML, CSS, JavaScript",
      interests: interests || "Autonomous AI Agents, Sci-Fi UI, Neural Architectures, Robotics",
      currentGoal: goalRow ? goalRow.content : "Become a World-Class AI Systems Engineer",
      nextMilestone: "Learn PyTorch & Deep Learning Fundamentals",
      roadmap: roadmapRow ? roadmapRow.content : "Master Ollama -> Build PHANTOM OS -> Deploy Autonomous Agents",
      progress: 42
    });
  });
});

module.exports = router;
