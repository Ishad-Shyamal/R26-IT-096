import { useMemo, useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import axios from "axios"; 
import { getPerformanceTier, getTierBg, getTierColor } from "../data/playersData";

const API_URL = "http://127.0.0.1:5001/players-predictions";

const COUNTRIES = [
  "All Countries",
  "Afghanistan",
  "Australia",
  "Bangladesh",
  "England",
  "India",
  "Ireland",
  "New Zealand",
  "Pakistan",
  "South Africa",
  "Sri Lanka",
  "West Indies",
  "Zimbabwe"
];

export default function NationalTeamPrediction() {
  const [selectedTournament] = useState<string>("All"); 
  const [threshold, setThreshold] = useState(0.5);
  const [sortByProb, setSortByProb] = useState(true);

  // ─── 🔍 SEARCH & COUNTRY FILTER STATES ───
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");

  // ─── 🔄 DYNAMIC DATA STATES ───
  const [dynamicPlayers, setDynamicPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayerData() {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setDynamicPlayers(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch ML insights from microservice:", err);
        setError("Could not load data from InsightCric Hub. Please make sure backend is running on port 5001 with CORS enabled.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlayerData();
  }, []);

  // ─── 📊 USEMEMO CALCULATIONS ───
  const playersWithProb = useMemo(() => {
    return dynamicPlayers
      .filter(p => {
        const matchesTournament = selectedTournament === "All" || p.tournament === selectedTournament;
        const matchesSearch = p.player_name.toLowerCase().includes(searchQuery.toLowerCase());
        const playerCountry = (p.country || p.team || "").toLowerCase().replace(/[\s_]+/g, "");
        const targetCountry = selectedCountry.toLowerCase().replace(/[\s_]+/g, "");
        const matchesCountry = selectedCountry === "All Countries" || playerCountry === targetCountry;

        return matchesTournament && matchesSearch && matchesCountry;
      })
      .sort((a, b) => sortByProb ? (b.nationalProb ?? b.iplProb) - (a.nationalProb ?? a.iplProb) : b.performance_score - a.performance_score);
  }, [dynamicPlayers, selectedTournament, sortByProb, searchQuery, selectedCountry]);

  const highProbPlayers = useMemo(() => {
    return playersWithProb.filter(p => (p.nationalProb ?? p.iplProb) >= threshold);
  }, [playersWithProb, threshold]);

  const lowProbPlayers = useMemo(() => {
    return playersWithProb.filter(p => (p.nationalProb ?? p.iplProb) < threshold);
  }, [playersWithProb, threshold]);

  // Pie chart
  const selectionPie = useMemo(() => {
    const sel = highProbPlayers.length;
    return [
      { name: "Predicted Selected", value: sel },
      { name: "Below Threshold", value: playersWithProb.length - sel },
    ];
  }, [highProbPlayers, playersWithProb]);

  // Probability distribution bins
  const probDistribution = useMemo(() => {
    const bins = [
      { range: "0-20%", min: 0, max: 0.2, count: 0 },
      { range: "20-40%", min: 0.2, max: 0.4, count: 0 },
      { range: "40-60%", min: 0.4, max: 0.6, count: 0 },
      { range: "60-80%", min: 0.6, max: 0.8, count: 0 },
      { range: "80-100%", min: 0.8, max: 1.1, count: 0 }, 
    ];
    playersWithProb.forEach(p => {
      const prob = p.nationalProb ?? p.iplProb;
      const bin = bins.find(b => prob >= b.min && prob < b.max);
      if (bin) bin.count++;
    });
    return bins;
  }, [playersWithProb]);

  // Performance score trend
  const trendData = useMemo(() => {
    return [...playersWithProb]
      .sort((a, b) => b.performance_score - a.performance_score)
      .slice(0, 20)
      .map((p, i) => ({
        rank: i + 1,
        score: +p.performance_score.toFixed(2),
        prob: +((p.nationalProb ?? p.iplProb) * 100).toFixed(1),
        name: p.player_name,
      }));
  }, [playersWithProb]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400">
        <div className="relative flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <div className="absolute text-xs font-semibold text-emerald-400">ML</div>
        </div>
        <p className="text-sm font-medium tracking-wide">Fetching ML predictions from InsightCric Hub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-4 text-center">
        <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-6 max-w-md shadow-2xl">
          <p className="text-base font-bold text-red-400 mb-2">⚠️ Connection Issue</p>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center text-xl shadow-lg shadow-emerald-950/40">
            🏏
          </div>
          <div>
            <h1 className="text-white font-extrabold text-2xl tracking-tight">National Team Selection Prediction</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Machine learning metrics predicting national team selection probabilities</p>
          </div>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Predicted Selected", value: highProbPlayers.length, color: "from-emerald-500/20 to-emerald-900/10", textColor: "text-emerald-400", borderColor: "border-emerald-500/20" },
          { label: "High Prob (>70%)", value: playersWithProb.filter(p => (p.nationalProb ?? p.iplProb) >= 0.7).length, color: "from-amber-500/20 to-amber-900/10", textColor: "text-amber-400", borderColor: "border-amber-500/20" },
          { label: "Actual Selected", value: playersWithProb.filter(p => p.was_selected === 1).length, color: "from-sky-500/20 to-sky-900/10", textColor: "text-sky-400", borderColor: "border-sky-500/20" },
          { label: "Avg National Prob", value: playersWithProb.length ? (playersWithProb.reduce((s, p) => s + (p.nationalProb ?? p.iplProb), 0) / playersWithProb.length * 100).toFixed(1) + "%" : "0%", color: "from-purple-500/20 to-purple-900/10", textColor: "text-purple-400", borderColor: "border-purple-500/20" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} bg-slate-900/60 backdrop-blur-md border ${s.borderColor} rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-transform hover:-translate-y-1`}>
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">{s.label}</p>
            <p className={`text-3xl font-black ${s.textColor} mt-2`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ─── CHARTS SECTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[300px]">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-200 font-bold text-sm tracking-wide">Selection Ratio</h3>
            <span className="text-[11px] text-slate-500 bg-slate-800/80 px-2.5 py-1 rounded-full">Threshold: {(threshold * 100).toFixed(0)}%</span>
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selectionPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={82}
                  dataKey="value"
                  paddingAngle={6}
                >
                  {selectionPie.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? "#10b981" : "#334155"} stroke="transparent" />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Probability Distribution */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 h-[300px]">
          <h3 className="text-slate-200 font-bold text-sm tracking-wide">National Team Probability Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={probDistribution} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} name="Players" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 20 Trend Chart */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-slate-200 font-bold text-sm tracking-wide">Top 20 Players: Performance Score vs National Team Probability</h3>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="rank" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}
              itemStyle={{ color: "#e2e8f0" }}
              labelFormatter={(label, items) => items[0]?.payload ? `Player: ${items[0].payload.name} (#${label})` : `#${label}`}
            />
            <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316", r: 4 }} name="Perf Score" />
            <Line type="monotone" dataKey="prob" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} name="National Team Prob %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ─── TABLE SECTION ─── */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Filters Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <h3 className="text-white font-bold text-lg tracking-wide shrink-0">
            Player Selection Predictions
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* 🔍 Search Field */}
            <div className="relative flex-1 min-w-[240px] sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search player name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 text-slate-100 text-sm rounded-xl pl-10 pr-9 py-2.5 shadow-inner focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs bg-slate-800 hover:bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="bg-slate-950/90 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c}
                </option>
              ))}
            </select>

            {/* Threshold Slider */}
            <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2">
              <label className="text-slate-400 text-xs font-medium">Threshold:</label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={e => setThreshold(+e.target.value)}
                className="w-16 accent-emerald-500 cursor-pointer"
              />
              <span className="text-emerald-400 text-xs font-bold w-7 text-right font-mono">{(threshold * 100).toFixed(0)}%</span>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortByProb(!sortByProb)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-all active:scale-95"
            >
              Sort: {sortByProb ? "Probability" : "Performance"}
            </button>
          </div>
        </div>

        {/* Sub Header Metrics */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-6 text-xs">
          <span className="text-emerald-400 font-medium">✅ Predicted Selected: <strong className="font-bold">{highProbPlayers.length}</strong></span>
          <span className="text-slate-400 font-medium">❌ Below Threshold: <strong className="font-bold">{lowProbPlayers.length}</strong></span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4 text-center">Perf Score</th>
                <th className="py-3.5 px-4 text-center">Marker</th>
                <th className="py-3.5 px-4 text-center">Tier</th>
                <th className="py-3.5 px-4 text-center">National Team Prob</th>
                <th className="py-3.5 px-4 text-center">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {playersWithProb.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No players found matching your criteria.
                  </td>
                </tr>
              ) : (
                playersWithProb.map((player, idx) => {
                  const prob = player.nationalProb ?? player.iplProb;
                  const tier = getPerformanceTier(player.performance_score);
                  const isPredictedSelected = prob >= threshold;

                  return (
                    <tr key={player.player_name + idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-slate-500 text-center font-mono">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-slate-100 font-bold text-sm">{player.player_name}</p>
                          <p className="text-slate-500 text-[11px] font-medium">{player.role} · <span className="text-slate-400">{player.country || player.team}</span></p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="text-amber-400 font-bold text-sm">{player.performance_score.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="text-sky-400 font-medium">{player.marker_score}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md border ${getTierBg(tier)} ${getTierColor(tier)}`}>
                          {tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`font-mono font-bold ${prob >= threshold ? "text-emerald-400" : "text-slate-400"}`}>
                            {(prob * 100).toFixed(1)}%
                          </span>
                          <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${prob >= 0.7 ? "bg-emerald-400" : prob >= threshold ? "bg-amber-400" : "bg-slate-600"}`}
                              style={{ width: `${Math.min(prob * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                            isPredictedSelected 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}>
                            {isPredictedSelected ? "✓ Selected" : "✕ Not Selected"}
                          </span>
                          {player.was_selected !== undefined && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              Actual: {player.was_selected === 1 ? "Selected" : "Not Selected"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}