const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Get all projects
router.get("/", (req, res) => {
  db.all("SELECT * FROM projects ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create project
router.post("/", (req, res) => {
  const { name, description, status, progress, tech_stack } = req.body;
  if (!name) return res.status(400).json({ error: "Project name required" });

  db.run(
    "INSERT INTO projects (name, description, status, progress, tech_stack) VALUES (?, ?, ?, ?, ?)",
    [name, description || "", status || "In Progress", progress || 0, tech_stack || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID, name });
    }
  );
});

// Update project status/progress
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status, progress } = req.body;

  db.run(
    "UPDATE projects SET status = COALESCE(?, status), progress = COALESCE(?, progress) WHERE id = ?",
    [status, progress, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, updatedId: id });
    }
  );
});

// Delete project
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM projects WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deletedId: id });
  });
});

module.exports = router;
