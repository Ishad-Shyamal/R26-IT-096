// 1. MUST be at the very top: load env variables with explicit path
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

// 👈 Route එක Import කරගැනීම
const queryRoutes = require("./routes/queryRoutes");

const app = express();

// --- Debugging Setup ---
console.log("--- System Check ---");
console.log("MONGO_URI Loaded:", !!process.env.MONGO_URI);
console.log("PORT Loaded:", process.env.PORT);

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Database Connection Function ---
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4 // Dialog router DNS fix
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ Database Connection Error:", err.message);
    process.exit(1);
  }
};

// --- Routes ---
app.get("/", (req, res) => {
  res.send("InsightCric Player Analysis Microservice is Running");
});

// 👈 Query Engine එක සඳහා Route එක Register කිරීම
app.use("/api", queryRoutes);

app.post("/api/analyze", async (req, res) => {
  try {
    const { performance_score, marker_score, geopolitical_risk } = req.body;
    const mlResponse = await axios.post("http://localhost:5050/api/predict", {
      performance_score,
      marker_score,
      geopolitical_risk
    });
    res.json({ success: true, data: mlResponse.data });
  } catch (error) {
    console.error("ML Connection Error:", error.message);
    res.status(500).json({ success: false, error: "Could not connect to the ML Model." });
  }
});

// --- Server Startup Sequence ---
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Player Analysis Microservice is running on port ${PORT}`);
  });
};

startServer();