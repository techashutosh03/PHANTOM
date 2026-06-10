const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./phantom.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("PHANTOM Database Connected");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      progress INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
