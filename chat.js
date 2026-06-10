const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {

    const { message } = req.body;

    let reply = "Command received. Processing...";

    const msg = message.toLowerCase();

    if(msg.includes("hello")){
        reply = "Greetings. PHANTOM systems online.";
    }
    else if(msg.includes("stress")){
        reply = "Stress detected. Recommend focus mode and task prioritization.";
    }
    else if(msg.includes("mission")){
        reply = "Mission acknowledged and stored.";
    }
    else if(msg.includes("goal")){
        reply = "Goal registered. Progress tracking enabled.";
    }
    else{
        reply = `Analysis complete: ${message}`;
    }

    res.json({
        sender: "PHANTOM",
        reply
    });

});

module.exports = router;