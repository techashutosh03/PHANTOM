const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database connection
require("./database/init");

// Serve Static Frontend Files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// API Modular Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/ai"));
app.use("/api/memory", require("./routes/memory"));
app.use("/api/missions", require("./routes/missions"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/emotion", require("./routes/emotion"));
app.use("/api/commands", require("./routes/commands"));
app.use("/api/sos", require("./routes/sos"));
app.use("/api/health", require("./routes/health"));
app.use("/api/activity", require("./routes/activity"));

// Redirect root to Login Page
app.get("/", (req, res) => {
  res.redirect("/pages/login.html");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`
  =======================================================
  👻 PHANTOM V2 - Personal Intelligence Operating System
  =======================================================
  🌐 Server active on: http://localhost:${PORT}
  🔑 Login page:       http://localhost:${PORT}/pages/login.html
  ⚡ System Core:      ONLINE
  =======================================================
  `);
});