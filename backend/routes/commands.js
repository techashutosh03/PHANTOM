const express = require("express");
const router = express.Router();
const commandExecutor = require("../services/commandExecutor");

router.post("/execute", (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: "Command string required" });

  const result = commandExecutor.parseAndExecute(command);
  res.json(result);
});

module.exports = router;
