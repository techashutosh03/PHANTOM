const express = require("express");
const db = require("../database");

const router = express.Router();

router.post("/", (req, res) => {

  const { content } = req.body;

  db.run(
    "INSERT INTO notes(content) VALUES(?)",
    [content],
    function(err){

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        success:true,
        noteId:this.lastID
      });

    }
  );

});

router.get("/", (req,res)=>{

  db.all(
    "SELECT * FROM notes",
    [],
    (err,rows)=>{

      if(err){
        return res.status(500).json(err);
      }

      res.json(rows);

    }
  );

});

module.exports = router;