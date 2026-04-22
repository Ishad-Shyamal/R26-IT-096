const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Microservice 2 is Running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Player Performance Database Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Microservice 2 is running on port ${PORT}`);
});