const express = require("express");
const router = express.Router();
const db = require("../database/init");
const ollamaService = require("../services/ollamaService");
const memoryExtractor = require("../services/memoryExtractor");
const commandExecutor = require("../services/commandExecutor");

// Send Chat Message
router.post("/send", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message content required" });
  }

  const userMessage = message.trim();

  // Save user message to database
  db.run("INSERT INTO messages (role, content) VALUES (?, ?)", ["user", userMessage]);

  // 1. Check for System Command Execution
  const commandResult = commandExecutor.parseAndExecute(userMessage);
  if (commandResult.executed) {
    const reply = commandResult.message;
    db.run("INSERT INTO messages (role, content) VALUES (?, ?)", ["assistant", reply]);
    return res.json({
      response: reply,
      isSystemCommand: true,
      extractedMemory: null
    });
  }

  // 2. Selective Memory Extraction
  const extractedMemory = await memoryExtractor.evaluateAndExtract(userMessage);

  // 3. Retrieve Memory Context & Recent Chat History for AI
  const memoryContext = await new Promise((resolve) => {
    db.all("SELECT key_type, content FROM memory ORDER BY id DESC LIMIT 10", [], (err, rows) => {
      if (err || !rows) resolve([]);
      else resolve(rows);
    });
  });

  const chatHistory = await new Promise((resolve) => {
    db.all("SELECT role, content FROM messages ORDER BY id DESC LIMIT 6", [], (err, rows) => {
      if (err || !rows) resolve([]);
      else resolve(rows.reverse());
    });
  });

  // 4. Generate AI Response via Ollama or Jarvis Fallback
  let aiReply = await ollamaService.generateResponse(userMessage, chatHistory, memoryContext);

  // Append memory notification if memory was extracted
  if (extractedMemory) {
    aiReply += `\n\n🧠 *[PHANTOM Vault]* Remembered ${extractedMemory.key_type}: "${extractedMemory.content}"`;
  }

  // Save assistant message to database
  db.run("INSERT INTO messages (role, content) VALUES (?, ?)", ["assistant", aiReply]);

  return res.json({
    response: aiReply,
    isSystemCommand: false,
    extractedMemory: extractedMemory
  });
});

// Get Chat History
router.get("/history", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id ASC LIMIT 50", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
