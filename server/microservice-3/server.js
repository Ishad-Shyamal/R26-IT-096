const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// ── Root route ──
app.get("/", (req, res) => {
  res.send("Microservice 3 - Match Preview & Review is Running");
});

// ── Health check ──
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "match-preview-review", port: 5003 });
});

// ── Get Match Preview (Probable 11) ──
app.post("/api/match-preview", async (req, res) => {
  try {
    const { team1, team2, venue, format } = req.body; // Added format

    // Inside /api/match-preview AND /api/probable11
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/probable11", // Change 8001 to 8000 (standard FastAPI port)
      { team1, team2, venue, format }
    );

    // ... (rest of your MongoDB logic)

    // Save to MongoDB
    const db = mongoose.connection.db;
    await db.collection("match_previews").insertOne({
      team1,
      team2,
      venue,
      prediction: mlResponse.data,
      createdAt: new Date(),
    });

    res.json({ success: true, data: mlResponse.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Get Probable 11 (calls Python ML) ──
app.post("/api/probable11", async (req, res) => {
  try {
    // 1. Get ALL 4 fields from the request body
    const { team1, team2, venue, format } = req.body;

    // 2. Pass ALL 4 fields to FastAPI
    // Inside /api/match-preview AND /api/probable11
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/probable11", // Change 8001 to 8000 (standard FastAPI port)
      { team1, team2, venue, format }
    );

    res.json({ success: true, data: mlResponse.data });
  } catch (error) {
    // If FastAPI returns 422, axios throws an error. 
    // This will help you see the specific validation error in your Node terminal:
    console.error("ML Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Get Match Review (calls Python ML) ──
app.post("/api/match-review", async (req, res) => {
  try {
    const { team1, team2, format, match_date } = req.body;

    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/review/generate", // Point to the Review endpoint
      { team1, team2, format, match_date }
    );

    res.json({ success: true, data: mlResponse.data });
  } catch (error) {
    console.error("Review Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── MongoDB connect ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Match Preview and Review Database Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Microservice 3 is running on port ${PORT}`);
});