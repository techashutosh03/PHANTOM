const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    mode: "SOS",
    status: "ACTIVE",
    message: "Emergency Protocol Started"
  });
});

module.exports = router;