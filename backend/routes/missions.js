const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Get all missions
router.get("/", (req, res) => {
  db.all("SELECT * FROM missions ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create new mission
router.post("/", (req, res) => {
  const { title, category } = req.body;
  if (!title) return res.status(400).json({ error: "Mission title required" });

  db.run(
    "INSERT INTO missions (title, category) VALUES (?, ?)",
    [title, category || "general"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      
      db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
        "MISSION_ADDED",
        `Created mission: ${title}`
      ]);

      res.json({ success: true, id: this.lastID, title, progress: 0, status: "active" });
    }
  );
});

// Update mission progress/status
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { progress, status } = req.body;

  db.run(
    "UPDATE missions SET progress = COALESCE(?, progress), status = COALESCE(?, status) WHERE id = ?",
    [progress, status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (status === "completed") {
        db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
          "MISSION_COMPLETED",
          `Completed mission ID ${id}`
        ]);
      }

      res.json({ success: true, updatedId: id });
    }
  );
});

// Delete mission
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM missions WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deletedId: id });
  });
});

module.exports = router;
