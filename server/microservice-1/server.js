const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); 
require("dotenv").config();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("InsightCric Player Analysis Microservice is Running");
});

/**
 * @route   POST /api/analyze
 * @desc    Receive player data and communicate with Python ML Engine
 * @access  Public
 */
app.post("/api/analyze", async (req, res) => {
  try {
    const { performance_score, marker_score, geopolitical_risk } = req.body;

    // Sending data to the Python ML API running on Port 5050
    const mlResponse = await axios.post("http://localhost:5050/api/predict", {
      performance_score,
      marker_score,
      geopolitical_risk
    });

    // Send the ML prediction results back to the React Frontend
    res.json({
      success: true,
      data: mlResponse.data
    });

  } catch (error) {
    console.error("ML Connection Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Could not connect to the ML Model. Ensure the Python server is running on Port 5050." 
    });
  }
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ News Database Connected Successfully"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// --- Server Configuration ---
// This Node.js Microservice runs on Port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Player Analysis Microservice is running on port ${PORT}`);
});