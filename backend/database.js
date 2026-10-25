const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./phantom.db", (err) => {
  if (err) {
    console.log("❌ Database Error:", err.message);
  } else {
    console.log("✅ PHANTOM Database Connected");
  }
});

// SAHI SYNTAX - arrow function with parentheses
db.serialize(() => {
  // Notes table
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Missions table
  db.run(`CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Messages table for chat history
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default_user',
    role TEXT CHECK(role IN ('user', 'assistant')),
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Activity logs table
  db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'default_user',
    action TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;