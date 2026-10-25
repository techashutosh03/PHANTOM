const express = require("express");
const router = express.Router();
const db = require("../database/init");

let sosState = {
  active: false,
  locationStatus: "Location Available",
  message: "Emergency Guardian standby",
  lastTriggered: null
};

router.get("/status", (req, res) => {
  res.json(sosState);
});

router.post("/trigger", (req, res) => {
  const { customMessage } = req.body;

  sosState = {
    active: true,
    locationStatus: "Location Available",
    message: customMessage || "🚨 EMERGENCY SOS ACTIVATED. Emergency contacts notified.",
    lastTriggered: new Date().toISOString()
  };

  db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
    "SOS_ACTIVATED",
    `SOS Emergency Mode triggered. Message: ${sosState.message}`
  ]);

  res.json({
    success: true,
    state: sosState
  });
});

router.post("/reset", (req, res) => {
  sosState.active = false;
  sosState.message = "Emergency Guardian standby";

  db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
    "SOS_RESET",
    "SOS Emergency Mode disarmed"
  ]);

  res.json({ success: true, state: sosState });
});

module.exports = router;