const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Microservice 3 is Running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Match Preview and Review Database Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Microservice 3 is running on port ${PORT}`);
});