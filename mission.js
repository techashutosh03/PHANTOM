const express = require("express");
const db = require("../database");

const router = express.Router();

router.post("/", (req, res) => {

  const { title } = req.body;

  db.run(
    "INSERT INTO missions(title) VALUES(?)",
    [title],
    function(err) {

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        missionId: this.lastID
      });

    }
  );

});

router.get("/", (req, res) => {

  db.all(
    "SELECT * FROM missions",
    [],
    (err, rows) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json(rows);

    }
  );

});

module.exports = router;