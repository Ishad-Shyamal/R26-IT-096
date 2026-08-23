const express = require('express');
const router = express.Router();
// Mongo Player Model path
const Player = require('../models/Player'); 

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ result: "Query field cannot be empty." });

    const q = query.toLowerCase().trim();
    let resultText = "";

    // Helper function: Mongo Schema එකේ ඕනෑම Key එකකින් Player Name එක ආරක්ෂිතව ලබා ගැනීමට
    const getName = (p) => p.player_name || p.playerName || p.name || "Unknown Player";
    const getTeam = (p) => p.team || p.team_name || "N/A";
    const getNews = (p) => {
      if (Array.isArray(p.news) && p.news.length > 0) return p.news[0];
      if (typeof p.news === 'string') return p.news;
      return "No news available";
    };

    // 1. Top Performers Query (Flexible string check)
    if (q.includes("top performer") || q.includes("best player") || q.includes("top perform")) {
      const top = await Player.find()
        .sort({ performance_score: -1 })
        .limit(5);

      if (top.length > 0) {
        resultText = "🌟 Top Overall Performers:\n" + 
          top.map((p, i) => `${i + 1}. ${getName(p)} - ${p.performance_score || 0} pts`).join("\n");
      } else {
        resultText = "🌟 Top Overall Performers:\nNo player data found in database.";
      }
    }

    // 2. Wicket Milestones Query
    else if (q.includes("wicket") || q.includes("milestone")) {
      const milestones = await Player.find({
        $or: [
          { news: { $regex: /wicket|milestone/i } },
          { role: { $regex: /bowler/i } }
        ]
      }).limit(5);

      if (milestones.length > 0) {
        resultText = "🎯 Players with Wicket Milestones:\n" + 
          milestones.map(p => `• ${getName(p)}: ${getNews(p)}`).join("\n");
      } else {
        resultText = "🎯 Players with Wicket Milestones:\nNo recent wicket milestone news found.";
      }
    }

    // 3. IPL Selected Players Query
    else if (q.includes("ipl") || q.includes("selected")) {
      const selected = await Player.find({ was_selected: 1 })
        .sort({ performance_score: -1 })
        .limit(5);

      if (selected.length > 0) {
        resultText = "✅ Top IPL Selected Players:\n" + 
          selected.map(p => `• ${getName(p)} (${getTeam(p)}) - Marker: ${p.marker_score || 0}`).join("\n");
      } else {
        resultText = "✅ Top IPL Selected Players:\nNo selected players found.";
      }
    }

    // 4. Man of the Match Query
    else if (q.includes("man of match") || q.includes("mom") || q.includes("award")) {
      const players = await Player.find({ awards: { $regex: /man of the match/i } }).limit(5);
      
      if (players.length > 0) {
        resultText = "🏆 Man of the Match Award Winners:\n" + 
          players.map(p => `• ${getName(p)} (${getTeam(p)})`).join("\n");
      } else {
        resultText = "🏆 Man of the Match Award Winners:\nNo players found with Man of the Match awards.";
      }
    } 

    // 5. Best Bowlers Query
    else if (q.includes("bowler") || q.includes("bowling")) {
      const bowlers = await Player.find({ role: { $regex: /bowler/i } })
        .sort({ performance_score: -1 })
        .limit(5);
      
      if (bowlers.length > 0) {
        resultText = "⚡ Top Bowlers by Performance Score:\n" + 
          bowlers.map((p, i) => `${i + 1}. ${getName(p)} (${getTeam(p)}) - Score: ${p.performance_score || 0}`).join("\n");
      } else {
        resultText = "⚡ Top Bowlers:\nNo bowler records found.";
      }
    }

    // 6. Direct Player Name Lookup (Fallback)
    else {
      const player = await Player.findOne({ 
        $or: [
          { player_name: { $regex: new RegExp(q, "i") } },
          { name: { $regex: new RegExp(q, "i") } }
        ]
      });

      if (player) {
        resultText = `👤 Player Profile: ${getName(player)}\n` +
          `• Team: ${getTeam(player)}\n` +
          `• Role: ${player.role || 'N/A'}\n` +
          `• Performance Score: ${player.performance_score || 0}\n` +
          `• Marker Score: ${player.marker_score || 0}\n` +
          `• IPL Selected: ${player.was_selected === 1 ? 'Yes' : 'No'}\n` +
          `• Latest News: "${getNews(player)}"`;
      } else {
        resultText = `🤖 Sorry, I couldn't find any results matching "${query}". Try asking about 'Top Performers', 'Best Bowler', or 'IPL Selection'.`;
      }
    }

    res.status(200).json({ result: resultText });

  } catch (error) {
    console.error("Query Backend Error:", error);
    res.status(500).json({ result: "An error occurred while processing your query." });
  }
});

module.exports = router;