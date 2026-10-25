const express = require("express");
const router = express.Router();
const systemInfo = require("../utils/systemInfo");

router.get("/", async (req, res) => {
  try {
    const metrics = await systemInfo.getHealthMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
