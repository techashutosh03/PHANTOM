const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "phantom.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
  } else {
    console.log("✅ PHANTOM V2 Database Connected:", dbPath);
  }
});

db.serialize(() => {
  // Missions table
  db.run(`CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    category TEXT DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Notes (Second Brain) table
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'Personal',
    tags TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Smart Memory Vault table (Selective Memory Extraction)
  db.run(`CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_type TEXT NOT NULL, -- 'goal', 'skill', 'interest', 'roadmap', 'note', 'preference'
    content TEXT NOT NULL,
    source TEXT DEFAULT 'ai_extracted',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Projects Tracker table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'In Progress', -- 'In Progress', 'Completed', 'Planning'
    progress INTEGER DEFAULT 0,
    tech_stack TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Messages (Chat History) table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT DEFAULT 'commander',
    role TEXT CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    emotion TEXT DEFAULT 'neutral',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Activity Logs table
  db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // SOS Emergency Contacts table
  db.run(`CREATE TABLE IF NOT EXISTS sos_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    relation TEXT,
    status TEXT DEFAULT 'active'
  )`);

  // Vision Intelligence Scans table (PHANTOM V3)
  db.run(`CREATE TABLE IF NOT EXISTS vision_scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scan_type TEXT NOT NULL, -- 'camera', 'screen', 'circle', 'ocr', 'code', 'math', 'reverse_eng', 'doc'
    expert_mode TEXT DEFAULT 'Normal User', -- 'Normal User', 'Engineer', 'Developer', 'Doctor', 'Mechanic'
    query TEXT,
    detected_objects TEXT, -- JSON array string
    summary TEXT,
    reasoning TEXT, -- JSON object string: {what, why, how, recommendation, next_action}
    smart_actions TEXT, -- JSON array string
    raw_payload TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed default data if tables are empty
  db.get("SELECT COUNT(*) as count FROM vision_scans", [], (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO vision_scans (scan_type, expert_mode, query, detected_objects, summary, reasoning, smart_actions) VALUES (?, ?, ?, ?, ?, ?, ?)");
      stmt.run(
        "camera",
        "Developer",
        "Workstation Setup",
        JSON.stringify(["MacBook Air M2", "Coffee Mug", "Samsung Galaxy S24", "Notebook & Stylus"]),
        "Command workstation with active dual display and development environment.",
        JSON.stringify({
          what: "Apple Silicon Workstation with mobile testing device & note interface",
          why: "High productivity developer setup optimized for local AI & full-stack web builds",
          how: "Utilizing modern unified memory architecture and cross-device testing",
          recommendation: "Ensure active thermal dissipation during Ollama local LLM fine-tuning",
          next_action: "Launch VS Code & sync Second Brain notes to sqlite"
        }),
        JSON.stringify(["Open VS Code", "Sync Memory Vault", "Track Energy Level"])
      );
      stmt.finalize();
    }
  });

  // Seed default data if tables are empty
  db.get("SELECT COUNT(*) as count FROM projects", [], (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO projects (name, description, status, progress, tech_stack) VALUES (?, ?, ?, ?, ?)");
      stmt.run("PHANTOM V2", "Personal Intelligence Operating System", "In Progress", 85, "Node.js, Express, SQLite, HTML5/CSS3");
      stmt.run("TripVault", "AI-powered smart travel planner & itinerary vault", "In Progress", 50, "Python, FastAPI, React");
      stmt.run("Avenor", "Autonomous AI Code Review Agent", "Planning", 20, "Python, Ollama, LangChain");
      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM memory", [], (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO memory (key_type, content, source) VALUES (?, ?, ?)");
      stmt.run("goal", "Become a World-Class AI Systems Engineer", "system_init");
      stmt.run("skill", "Java, Node.js, Python, HTML, CSS, JavaScript", "system_init");
      stmt.run("interest", "Autonomous AI Agents, Sci-Fi UI, Neural Architectures, Robotics", "system_init");
      stmt.run("roadmap", "Master Ollama & LLM Integration -> Build PHANTOM OS -> Deploy Autonomous Agents", "system_init");
      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM missions", [], (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO missions (title, progress, status, category) VALUES (?, ?, ?, ?)");
      stmt.run("Initialize PHANTOM V2 Intelligence Core", 100, "completed", "system");
      stmt.run("Integrate Local Ollama Llama 3 Model", 80, "active", "ai");
      stmt.run("Deploy PHANTOM Skills Engine & Next Milestone", 40, "active", "feature");
      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM notes", [], (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO notes (title, content, category, tags) VALUES (?, ?, ?, ?)");
      stmt.run("PHANTOM V2 Architecture Directive", "PHANTOM is designed to feel like Jarvis. High performance, dark HUD aesthetic, safe system command execution.", "AI", "architecture,jarvis");
      stmt.run("Next Skill Target: PyTorch & LLM Fine-Tuning", "Deep dive into model fine-tuning and local inference optimization for low latency responses.", "Work", "ai,skills");
      stmt.finalize();
    }
  });
});

module.exports = db;
