const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Get all memory vault items
router.get("/", (req, res) => {
  db.all("SELECT * FROM memory ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Save manual memory item
router.post("/", (req, res) => {
  const { key_type, content } = req.body;
  if (!content) return res.status(400).json({ error: "Content required" });

  const type = key_type || "note";
  db.run(
    "INSERT INTO memory (key_type, content, source) VALUES (?, ?, ?)",
    [type, content, "manual_entry"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      
      db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
        "MEMORY_SAVED",
        `Manual ${type}: ${content.substring(0, 40)}`
      ]);

      res.json({ success: true, id: this.lastID, key_type: type, content });
    }
  );
});

// Delete memory item ("Forget this...")
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM memory WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deletedId: id });
  });
});

module.exports = router;
