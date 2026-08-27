// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require('path');
// require("dotenv").config();
// const { spawn } = require('child_process'); // Module to run python scripts

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Microservice 2 is Running");
// });



// const fs = require("fs/promises");

// app.get("/api/countries", async (req, res) => {
//     try {
//         const predictionsDir = path.join(__dirname, "predictions");
//         const files = await fs.readdir(predictionsDir, { withFileTypes: true });

//         const countries = files
//             .filter(file => file.isFile() && path.extname(file.name).toLowerCase() === ".csv")
//             .map(file => path.basename(file.name, ".csv"))
//             .sort();

//         res.json(countries);
//     } catch (error) {
//         console.error("Failed to read prediction countries:", error);
//         res.status(500).json({ error: "Unable to load countries" });
//     }
// });

// app.get('/api/players', async (req, res) => {
//     try {
//         const { country } = req.query;

//         if (!country || typeof country !== 'string') {
//             return res.status(400).json({
//                 error: 'Country query parameter is required'
//             });
//         }

//         const predictionsDir = path.join(__dirname, 'predictions');
//         const files = await fs.readdir(predictionsDir, { withFileTypes: true });

//         const countryFile = files.find((file) => {
//             return (
//                 file.isFile() &&
//                 path.extname(file.name).toLowerCase() === '.csv' &&
//                 path.basename(file.name, '.csv').toLowerCase() === country.trim().toLowerCase()
//             );
//         });

//         if (!countryFile) {
//             return res.status(404).json({
//                 error: `No prediction file found for ${country}`
//             });
//         }

//         const filePath = path.join(predictionsDir, countryFile.name);
//         const csvContent = await fs.readFile(filePath, 'utf8');

//         const rows = csvContent
//             .split(/\r?\n/)
//             .map((row) => row.trim())
//             .filter(Boolean);

//         if (rows.length <= 1) {
//             return res.json([]);
//         }

//         const headers = rows[0]
//             .split(',')
//             .map((header) => header.trim().toLowerCase());

//         const playerColumnIndex = headers.findIndex(
//             (header) => header === 'player' || header === 'player name'
//         );

//         if (playerColumnIndex === -1) {
//             return res.status(500).json({
//                 error: 'Player column was not found in the CSV file'
//             });
//         }

//         const players = rows
//             .slice(1)
//             .map((row) => {
//                 return row
//                     .split(',')
//                     .map((value) => value.trim().replace(/^"|"$/g, ''))[
//                     playerColumnIndex
//                 ];
//             })
//             .filter(Boolean);

//         const uniquePlayers = [...new Set(players)].sort((first, second) =>
//             first.localeCompare(second)
//         );

//         res.json(uniquePlayers);
//     } catch (error) {
//         console.error('Failed to load players:', error);

//         res.status(500).json({
//             error: 'Unable to load players'
//         });
//     }
// });

// app.post('/api/predict', (req, res) => {
//     const { playerName, country, category } = req.body;

//     const pythonExecutable = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
//     const scriptPath = path.join(__dirname, 'scripts', 'predict.py');

//     const pythonProcess = spawn(pythonExecutable, [
//         scriptPath,
//         playerName,
//         country,
//         category
//     ]);

//     let resultData = '';
//     let errorData = ''; // To capture Python errors

//     pythonProcess.stdout.on('data', (data) => {
//         resultData += data.toString();
//     });

//     // Capture errors from Python (e.g., if a library is missing)
//     pythonProcess.stderr.on('data', (data) => {
//         errorData += data.toString();
//     });

//     pythonProcess.on('close', (code) => {
//         if (code !== 0) {
//             console.error(`Python Error: ${errorData}`);
//             return res.status(500).json({ error: "Python script failed", details: errorData });
//         }
//         try {
//             const prediction = JSON.parse(resultData);
//             res.status(200).json(prediction);
//         } catch (error) {
//             res.status(500).json({ error: "Failed to parse Python output" });
//         }
//     });
// });

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Player Performance Database Connected"))
//     .catch(err => console.log(err));

// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//     console.log(`Microservice 2 is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
require('dotenv').config();
const { spawn } = require('child_process'); // Module to run python scripts

const app = express();

app.use(cors());
app.use(express.json());

const predictionsDirectory = path.join(__dirname, 'predictions');

app.get('/', (req, res) => {
    res.send('Microservice 2 is Running');
});

app.get('/api/countries', async (req, res) => {
    try {
        const files = await fs.readdir(predictionsDirectory, {
            withFileTypes: true
        });

        const countries = files
            .filter(
                (file) =>
                    file.isFile() &&
                    path.extname(file.name).toLowerCase() === '.csv'
            )
            .map((file) => path.basename(file.name, '.csv'))
            .sort((first, second) => first.localeCompare(second));

        res.json(countries);
    } catch (error) {
        console.error('Failed to read countries:', error);

        res.status(500).json({
            status: 'error',
            message: 'Unable to load countries'
        });
    }
});

const normalizeFormat = (format) => {
    const value = String(format || '').trim().toUpperCase();

    if (value === 'T20I' || value === 'T20') {
        return 'T20';
    }

    if (value === 'TEST') {
        return 'TEST';
    }

    if (value === 'ODI') {
        return 'ODI';
    }

    return value;
};

const parseCsvLine = (line) => {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];

        if (character === '"') {
            if (insideQuotes && line[index + 1] === '"') {
                currentValue += '"';
                index += 1;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (character === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += character;
        }
    }

    values.push(currentValue.trim());

    return values;
};

const parseCsv = (content) => {
    const rows = content
        .split(/\r?\n/)
        .filter((row) => row.trim().length > 0)
        .map(parseCsvLine);

    if (rows.length < 2) {
        return [];
    }

    const headers = rows[0].map((header) => header.trim());

    return rows.slice(1).map((row) => {
        const record = {};

        headers.forEach((header, index) => {
            record[header] = row[index] || '';
        });

        return record;
    });
};

const getRecordValue = (record, names) => {
    const recordKeys = Object.keys(record);

    const matchingKey = recordKeys.find((key) =>
        names.includes(key.trim().toLowerCase())
    );

    return matchingKey ? record[matchingKey] : '';
};

app.get('/api/players', async (req, res) => {
    try {
        const { country } = req.query;

        if (!country || typeof country !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Country query parameter is required'
            });
        }

        const files = await fs.readdir(predictionsDirectory, {
            withFileTypes: true
        });

        const countryFile = files.find(
            (file) =>
                file.isFile() &&
                path.extname(file.name).toLowerCase() === '.csv' &&
                path.basename(file.name, '.csv').toLowerCase() ===
                    country.trim().toLowerCase()
        );

        if (!countryFile) {
            return res.status(404).json({
                status: 'error',
                message: `No prediction file found for ${country}`
            });
        }

        const filePath = path.join(predictionsDirectory, countryFile.name);
        const csvContent = await fs.readFile(filePath, 'utf8');
        const records = parseCsv(csvContent);

        const players = records
            .map((record) =>
                String(getRecordValue(record, ['player', 'player name'])).trim()
            )
            .filter(Boolean);

        const uniquePlayers = [...new Set(players)].sort((first, second) =>
            first.localeCompare(second)
        );

        res.json(uniquePlayers);
    } catch (error) {
        console.error('Failed to load players:', error);

        res.status(500).json({
            status: 'error',
            message: 'Unable to load players'
        });
    }
});

app.post('/api/predict', async (req, res) => {
    try {
        const { playerName, country, category } = req.body;

        if (!playerName || !country || !category) {
            return res.status(400).json({
                status: 'error',
                message: 'playerName, country and category are required'
            });
        }

        const files = await fs.readdir(predictionsDirectory, {
            withFileTypes: true
        });

        const countryFile = files.find(
            (file) =>
                file.isFile() &&
                path.extname(file.name).toLowerCase() === '.csv' &&
                path.basename(file.name, '.csv').toLowerCase() ===
                    String(country).trim().toLowerCase()
        );

        if (!countryFile) {
            return res.status(404).json({
                status: 'error',
                message: `No prediction file found for ${country}`
            });
        }

        const filePath = path.join(predictionsDirectory, countryFile.name);
        const csvContent = await fs.readFile(filePath, 'utf8');
        const records = parseCsv(csvContent);

        const requestedPlayer = String(playerName).trim().toLowerCase();
        const requestedFormat = normalizeFormat(category);

        const matchingRecord = records.find((record) => {
            const recordPlayer = String(
                getRecordValue(record, ['player', 'player name'])
            )
                .trim()
                .toLowerCase();

            const recordFormat = normalizeFormat(
                getRecordValue(record, ['format', 'category', 'match type'])
            );

            return (
                recordPlayer === requestedPlayer &&
                recordFormat === requestedFormat
            );
        });

        if (!matchingRecord) {
            return res.status(404).json({
                status: 'error',
                message: `No prediction found for ${playerName} in ${country} (${category})`
            });
        }

        res.json({
            status: 'success',
            country,
            playerName,
            category,
            prediction: matchingRecord
        });
    } catch (error) {
        console.error('Prediction lookup failed:', error);

        res.status(500).json({
            status: 'error',
            message: 'Unable to load prediction details'
        });
    }
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Player Performance Database Connected'))
    .catch((error) => console.log(error));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Microservice 2 is running on port ${PORT}`);
});