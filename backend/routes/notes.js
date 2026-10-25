const express = require("express");
const router = express.Router();
const db = require("../database/init");

// Get all notes with optional category filter or search query
router.get("/", (req, res) => {
  const { category, search } = req.query;

  let sql = "SELECT * FROM notes";
  const params = [];
  const conditions = [];

  if (category && category !== "All") {
    conditions.push("category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("(title LIKE ? OR content LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create note
router.post("/", (req, res) => {
  const { title, content, category, tags } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and Content required" });

  db.run(
    "INSERT INTO notes (title, content, category, tags) VALUES (?, ?, ?, ?)",
    [title, content, category || "Personal", tags || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID, title, category });
    }
  );
});

// Delete note
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM notes WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deletedId: id });
  });
});

module.exports = router;