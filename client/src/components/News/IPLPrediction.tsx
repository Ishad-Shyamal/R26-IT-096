import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import { players, getIPLProbability, getPerformanceTier, getTierBg, getTierColor } from "../data/playersData";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#eab308"];
const tournamentShort: Record<string, string> = {
  "Ranji Trophy": "Ranji",
  "Lanka Premier League": "LPL",
  "Pakistan Super League": "PSL",
};

export default function IPLPrediction() {
  const [selectedTournament, setSelectedTournament] = useState<string>("All");
  const [threshold, setThreshold] = useState(0.5);
  const [sortByProb, setSortByProb] = useState(true);

  const tournaments = ["All", "Ranji Trophy", "Lanka Premier League", "Pakistan Super League"];

  const playersWithProb = useMemo(() => {
    return players
      .filter(p => selectedTournament === "All" || p.tournament === selectedTournament)
      .map(p => ({ ...p, iplProb: getIPLProbability(p) }))
      .sort((a, b) => sortByProb ? b.iplProb - a.iplProb : b.performance_score - a.performance_score);
  }, [selectedTournament, sortByProb]);

  const highProbPlayers = playersWithProb.filter(p => p.iplProb >= threshold);
  const lowProbPlayers = playersWithProb.filter(p => p.iplProb < threshold);

  // Pie chart: selected vs not selected
  const selectionPie = useMemo(() => {
    const sel = players.filter(p => p.was_selected === 1).length;
    return [
      { name: "IPL Selected", value: sel },
      { name: "Not Selected", value: players.length - sel },
    ];
  }, []);

  // Probability distribution bins
  const probDistribution = useMemo(() => {
    const bins = [
      { range: "0-20%", min: 0, max: 0.2, count: 0 },
      { range: "20-40%", min: 0.2, max: 0.4, count: 0 },
      { range: "40-60%", min: 0.4, max: 0.6, count: 0 },
      { range: "60-80%", min: 0.6, max: 0.8, count: 0 },
      { range: "80-100%", min: 0.8, max: 1.0, count: 0 },
    ];
    players.forEach(p => {
      const prob = getIPLProbability(p);
      const bin = bins.find(b => prob >= b.min && prob < b.max);
      if (bin) bin.count++;
    });
    return bins;
  }, []);

  // Tournament-wise selection rate
  const tournamentSelection = useMemo(() => {
    const map: Record<string, { total: number; selected: number; avgProb: number }> = {};
    players.forEach(p => {
      if (!map[p.tournament]) map[p.tournament] = { total: 0, selected: 0, avgProb: 0 };
      map[p.tournament].total++;
      if (p.was_selected) map[p.tournament].selected++;
      map[p.tournament].avgProb += getIPLProbability(p);
    });
    return Object.entries(map).map(([name, v]) => ({
      name: tournamentShort[name] || name,
      selectionRate: +((v.selected / v.total) * 100).toFixed(1),
      avgProb: +((v.avgProb / v.total) * 100).toFixed(1),
      total: v.total,
      selected: v.selected,
    }));
  }, []);

  // Performance score trend by ranking
  const trendData = useMemo(() => {
    return players
      .sort((a, b) => b.performance_score - a.performance_score)
      .slice(0, 20)
      .map((p, i) => ({
        rank: i + 1,
        score: +p.performance_score.toFixed(2),
        prob: +(getIPLProbability(p) * 100).toFixed(1),
        name: p.player_name,
      }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-lg">🏏</div>
        <div>
          <h2 className="text-white font-bold text-xl">IPL Selection Prediction</h2>
          <p className="text-slate-400 text-sm">News-derived signals from LPL · Ranji Trophy · PSL · Predicting auction selection probability</p>
        </div>
      </div>

      {/* Model Explanation */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/60 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📰</span>
            <h4 className="text-white font-semibold text-sm">News Signal Extraction</h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">Man of Match citations, Best Bowler awards, and wicket milestones extracted from news headlines using NLP pattern matching.</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h4 className="text-white font-semibold text-sm">Scoring Formula</h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">IPL Probability = (Performance × 0.6 + Marker × 0.4 + Selection Boost) / 13. Calibrated from domestic cricket coverage.</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h4 className="text-white font-semibold text-sm">Geopolitical Factor</h4>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">Tournament origin (LPL/Ranji/PSL) mapped as geopolitical signals influencing selector visibility and news coverage weight.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Predicted Selected", value: players.filter(p => getIPLProbability(p) >= 0.5).length, color: "text-emerald-400", bg: "from-emerald-500 to-emerald-600" },
          { label: "High Probability (>70%)", value: players.filter(p => getIPLProbability(p) >= 0.7).length, color: "text-orange-400", bg: "from-orange-500 to-red-500" },
          { label: "Actually Selected", value: players.filter(p => p.was_selected === 1).length, color: "text-blue-400", bg: "from-blue-500 to-blue-600" },
          { label: "Avg IPL Probability", value: (players.reduce((s, p) => s + getIPLProbability(p), 0) / players.length * 100).toFixed(1) + "%", color: "text-purple-400", bg: "from-purple-500 to-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie Chart */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm">IPL Selection Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={selectionPie}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={4}
              >
                {selectionPie.map((_, idx) => (
                  <Cell key={idx} fill={idx === 0 ? "#22c55e" : "#334155"} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px" }}
                itemStyle={{ color: "#94a3b8" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Probability Distribution */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm">IPL Probability Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={probDistribution} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="range" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px" }}
                itemStyle={{ color: "#94a3b8" }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} name="Players" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tournament Selection Rate */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm">Selection Rate by Tournament</h3>
          <div className="space-y-4 pt-2">
            {tournamentSelection.map((t, idx) => (
              <div key={t.name} className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300 text-xs font-medium">{t.name}</span>
                  <span className="text-xs text-slate-400">{t.selected}/{t.total}</span>
                </div>
                <div className="bg-slate-700/50 rounded-full h-2.5 relative">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${t.selectionRate}%`,
                      backgroundColor: COLORS[idx % COLORS.length]
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-500">Selection Rate: {t.selectionRate}%</span>
                  <span className="text-[10px] text-slate-500">Avg Prob: {t.avgProb}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 20 Trend */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
        <h3 className="text-white font-semibold text-sm">Top 20 Players: Performance Score vs IPL Probability</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="rank" tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Rank", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -5 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px" }}
              itemStyle={{ color: "#94a3b8" }}
              labelFormatter={(label) => `Rank #${label}`}
            />
            <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 3 }} name="Perf Score" />
            <Line type="monotone" dataKey="prob" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} name="IPL Prob %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Player Prediction Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 space-y-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <h3 className="text-white font-semibold text-sm">Player Selection Predictions</h3>
            <div className="flex items-center gap-3">
              <label className="text-slate-400 text-xs">Threshold:</label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={e => setThreshold(+e.target.value)}
                className="w-24 accent-orange-500"
              />
              <span className="text-orange-400 text-xs font-bold w-10">{(threshold * 100).toFixed(0)}%</span>
              <button
                onClick={() => setSortByProb(!sortByProb)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500 transition-all"
              >
                Sort: {sortByProb ? "Probability" : "Performance"}
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tournaments.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTournament(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedTournament === t
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500"
                }`}
              >
                {t === "All" ? t : (tournamentShort[t] || t)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats above table */}
        <div className="px-4 py-3 border-b border-slate-700/30 flex gap-4 text-xs">
          <span className="text-emerald-400">✅ Predicted Selected: <strong>{highProbPlayers.length}</strong></span>
          <span className="text-slate-400">❌ Below Threshold: <strong>{lowProbPlayers.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="text-left py-3 px-4 text-slate-400 text-xs font-medium">#</th>
                <th className="text-left py-3 px-4 text-slate-400 text-xs font-medium">Player</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">Tournament</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">Perf Score</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">Marker</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">Tier</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">IPL Prob</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">Predicted</th>
                <th className="text-center py-3 px-3 text-slate-400 text-xs font-medium">Actual</th>
              </tr>
            </thead>
            <tbody>
              {playersWithProb.map((player, idx) => {
                const tier = getPerformanceTier(player.performance_score);
                const predicted = player.iplProb >= threshold;
                const correct = (predicted && player.was_selected === 1) || (!predicted && player.was_selected === 0);
                return (
                  <tr key={player.player_name} className="border-t border-slate-700/30 hover:bg-slate-700/20 transition-all">
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{idx + 1}</td>
                    <td className="py-2.5 px-4">
                      <div>
                        <p className="text-white text-xs font-medium">{player.player_name}</p>
                        <p className="text-slate-500 text-[10px]">{player.role} · {player.team}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-slate-300 text-xs">{tournamentShort[player.tournament]}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-orange-400 font-bold text-xs">{player.performance_score.toFixed(2)}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-blue-400 text-xs">{player.marker_score}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${getTierBg(tier)} ${getTierColor(tier)}`}>{tier}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${player.iplProb >= threshold ? "text-emerald-400" : "text-slate-400"}`}>
                          {(player.iplProb * 100).toFixed(1)}%
                        </span>
                        <div className="w-16 bg-slate-700 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${player.iplProb >= 0.7 ? "bg-emerald-500" : player.iplProb >= threshold ? "bg-orange-500" : "bg-slate-500"}`}
                            style={{ width: `${player.iplProb * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-xs font-bold ${predicted ? "text-emerald-400" : "text-slate-500"}`}>
                        {predicted ? "✅ Yes" : "❌ No"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-xs ${correct ? "text-emerald-400" : "text-red-400"} ${player.was_selected ? "font-bold" : ""}`}>
                        {player.was_selected ? "✓ Selected" : "—"} {correct ? "🎯" : ""}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
