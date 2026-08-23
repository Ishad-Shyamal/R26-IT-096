// server/microservice-1/models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  player_name: { type: String, required: true },
  team: { type: String, required: true },
  role: { type: String, required: true }, // "Batsman", "Bowler", "All-Rounder", "Wicket-Keeper", "Opener"
  performance_score: { type: Number, required: true },
  marker_score: { type: Number, required: true },
  was_selected: { type: Number, default: 0 }, // 1 = Selected, 0 = Unsold
  awards: [{ type: String }],                  // Array of strings e.g. ["Man of the Match"]
  news: [{ type: String }]                     // Array of news headlines/details
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);