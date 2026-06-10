const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

require("./database");

app.use("/chat", require("./routes/chat"));
app.use("/missions", require("./routes/mission"));
app.use("/notes", require("./routes/notes"));
app.use("/sos", require("./routes/sos"));

app.get("/", (req, res) => {

  res.json({
    project: "PHANTOM",
    status: "ONLINE",
    version: "1.0"
  });

});

app.listen(5000, () => {
  console.log("PHANTOM ONLINE ON PORT 5000");
});