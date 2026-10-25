const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Get all activity logs
router.get("/", (req, res) => {
  db.all("SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 50", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Manual activity log entry
router.post("/log", (req, res) => {
  const { action, details } = req.body;
  if (!action) return res.status(400).json({ error: "Action required" });

  db.run(
    "INSERT INTO activity_logs (action, details) VALUES (?, ?)",
    [action, details || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

module.exports = router;
