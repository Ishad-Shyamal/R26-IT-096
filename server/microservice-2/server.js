const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();
const { spawn } = require('child_process'); // Module to run python scripts

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Microservice 2 is Running");
});

app.post('/api/predict', (req, res) => {
    const { playerName, country, category } = req.body;

    const pythonExecutable = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
    const scriptPath = path.join(__dirname, 'scripts', 'predict.py');

    const pythonProcess = spawn(pythonExecutable, [
        scriptPath,
        playerName,
        country,
        category
    ]);

    let resultData = '';
    let errorData = ''; // To capture Python errors

    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    // Capture errors from Python (e.g., if a library is missing)
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python Error: ${errorData}`);
            return res.status(500).json({ error: "Python script failed", details: errorData });
        }
        try {
            const prediction = JSON.parse(resultData);
            res.status(200).json(prediction);
        } catch (error) {
            res.status(500).json({ error: "Failed to parse Python output" });
        }
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Player Performance Database Connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Microservice 2 is running on port ${PORT}`);
});