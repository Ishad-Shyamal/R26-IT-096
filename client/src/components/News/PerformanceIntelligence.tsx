import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, ZAxis
} from "recharts";
import { players, getPerformanceTier, getTierColor, getIPLProbability } from "../data/playersData";
import { useApp } from "../context/AppContext";

const roleIcons: Record<string, string> = {
  "Batsman": "🏏", "Bowler": "⚡", "All-Rounder": "🌟", "Wicket-Keeper": "🧤", "Opener": "🚀",
};

export default function PerformanceIntelligence() {
  const { selectedPlayer, setSelectedPlayer, userPrefs, toggleFavoritePlayer } = useApp();
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortField, setSortField] = useState<"performance_score" | "marker_score">("performance_score");
  const [searchName, setSearchName] = useState("");

  const roles = ["All", "Batsman", "Bowler", "All-Rounder", "Wicket-Keeper", "Opener"];

  const filteredPlayers = useMemo(() => {
    return players
      .filter(p => {
        const matchRole = roleFilter === "All" || p.role === roleFilter;
        const matchName = !searchName || p.player_name.toLowerCase().includes(searchName.toLowerCase());
        return matchRole && matchName;
      })
      .sort((a, b) => b[sortField] - a[sortField]);
  }, [roleFilter, sortField, searchName]);

  // Tournament breakdown for bar chart
  const tournamentStats = useMemo(() => {
    const map: Record<string, { total: number; count: number; selected: number }> = {};
    players.forEach(p => {
      if (!map[p.tournament]) map[p.tournament] = { total: 0, count: 0, selected: 0 };
      map[p.tournament].total += p.performance_score;
      map[p.tournament].count++;
      if (p.was_selected) map[p.tournament].selected++;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.replace("Lanka Premier League", "LPL").replace("Pakistan Super League", "PSL").replace("Ranji Trophy", "Ranji"),
      avgScore: +(v.total / v.count).toFixed(2),
      selected: v.selected,
      total: v.count,
    }));
  }, []);

  // Award distribution
  const awardStats = useMemo(() => {
    const map: Record<string, number> = {};
    players.forEach(p => p.awards.forEach(a => { map[a] = (map[a] || 0) + 1; }));
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, []);

  // Radar data for selected player
  const radarData = selectedPlayer ? [
    { metric: "Performance", value: (selectedPlayer.performance_score / 10) * 100 },
    { metric: "Marker", value: (selectedPlayer.marker_score / 5) * 100 },
    { metric: "IPL Prob", value: getIPLProbability(selectedPlayer) * 100 },
    { metric: "Selection", value: selectedPlayer.was_selected * 100 },
    { metric: "Geo Factor", value: (selectedPlayer.geopolitical / 5) * 100 },
  ] : [];

  // Scatter data
  const scatterData = useMemo(() =>
    filteredPlayers.slice(0, 40).map(p => ({
      x: +p.performance_score.toFixed(2),
      y: p.marker_score,
      z: p.was_selected ? 80 : 40,
      name: p.player_name,
      selected: p.was_selected,
    })), [filteredPlayers]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Section Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-lg">📊</div>
        <div>
          <h2 className="text-white font-bold text-xl">Player Performance Intelligence</h2>
          <p className="text-slate-400 text-sm">NLP-extracted signals from news coverage · Man of Match · Wicket Milestones · Season Profiles</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Players", value: players.length, icon: "👥", color: "from-blue-500 to-blue-600" },
          { label: "IPL Selected", value: players.filter(p => p.was_selected).length, icon: "✅", color: "from-emerald-500 to-emerald-600" },
          { label: "Elite Performers", value: players.filter(p => p.performance_score >= 8).length, icon: "🌟", color: "from-orange-500 to-red-500" },
          { label: "Award Winners", value: players.filter(p => p.awards.length > 0).length, icon: "🏆", color: "from-purple-500 to-purple-600" },
        ].map(card => (
          <div key={card.label} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl shadow-lg`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-slate-400 text-xs">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tournament Bar Chart */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm">Avg Performance by Tournament</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tournamentStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px" }}
                labelStyle={{ color: "#f1f5f9" }}
                itemStyle={{ color: "#94a3b8" }}
              />
              <Bar dataKey="avgScore" fill="#f97316" radius={[6, 6, 0, 0]} name="Avg Score" />
              <Bar dataKey="selected" fill="#22c55e" radius={[6, 6, 0, 0]} name="IPL Selected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Award Distribution */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-semibold text-sm">Award Citations from News Coverage</h3>
          <div className="space-y-2.5 pt-1">
            {awardStats.map(award => (
              <div key={award.name} className="flex items-center gap-3">
                <span className="text-slate-300 text-xs w-40 truncate">{award.name}</span>
                <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${(award.count / Math.max(...awardStats.map(a => a.count))) * 100}%` }}
                  />
                </div>
                <span className="text-orange-400 text-xs font-bold w-6 text-right">{award.count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700/50 pt-3">
            <p className="text-slate-500 text-xs">Extracted via NLP from news headlines & match reports</p>
          </div>
        </div>
      </div>

      {/* Performance vs Marker Scatter */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Performance Score vs Marker Score Distribution</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" /> IPL Selected</span>
            <span className="flex items-center gap-1 text-slate-400"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block" /> Not Selected</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="x" name="Performance" tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Performance Score", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -5 }} />
            <YAxis dataKey="y" name="Marker" tick={{ fill: "#94a3b8", fontSize: 11 }} label={{ value: "Marker", fill: "#64748b", fontSize: 10, angle: -90, position: "insideLeft" }} />
            <ZAxis dataKey="z" range={[30, 120]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px" }}
              labelStyle={{ color: "#f1f5f9" }}
              formatter={(value, name) => [value, name]}
            />
            <Scatter
              data={scatterData.filter(d => d.selected === 1)}
              fill="#22c55e"
              opacity={0.8}
            />
            <Scatter
              data={scatterData.filter(d => d.selected === 0)}
              fill="#64748b"
              opacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Player Table + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Player List */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 border-b border-slate-700/50 space-y-3">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Season Performer Profiles</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortField("performance_score")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${sortField === "performance_score" ? "bg-orange-500/30 border-orange-500/50 text-orange-300" : "bg-slate-700 border-slate-600 text-slate-400"}`}
                >
                  By Performance
                </button>
                <button
                  onClick={() => setSortField("marker_score")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${sortField === "marker_score" ? "bg-blue-500/30 border-blue-500/50 text-blue-300" : "bg-slate-700 border-slate-600 text-slate-400"}`}
                >
                  By Marker
                </button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search player..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                className="flex-1 min-w-[160px] bg-slate-900/60 border border-slate-600 rounded-xl px-3 py-2 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500/60"
              />
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${roleFilter === r ? "bg-orange-500/30 border-orange-500/50 text-orange-300" : "bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500"}`}
                >
                  {r === "All" ? r : roleIcons[r] + " " + r}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-400 text-xs font-medium">Player</th>
                  <th className="text-center py-3 px-2 text-slate-400 text-xs font-medium">Perf</th>
                  <th className="text-center py-3 px-2 text-slate-400 text-xs font-medium">Marker</th>
                  <th className="text-center py-3 px-2 text-slate-400 text-xs font-medium">Tier</th>
                  <th className="text-center py-3 px-2 text-slate-400 text-xs font-medium">IPL</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, idx) => {
                  const tier = getPerformanceTier(player.performance_score);
                  const isSelected = selectedPlayer?.player_name === player.player_name;
                  return (
                    <tr
                      key={player.player_name}
                      onClick={() => setSelectedPlayer(isSelected ? null : player)}
                      className={`border-t border-slate-700/30 cursor-pointer transition-all ${
                        isSelected ? "bg-orange-500/10" : "hover:bg-slate-700/30"
                      }`}
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs w-5">{idx + 1}</span>
                          <span className="text-sm">{roleIcons[player.role]}</span>
                          <div>
                            <p className="text-white text-xs font-medium">{player.player_name}</p>
                            <p className="text-slate-500 text-[10px]">{player.tournament.replace("Lanka Premier League", "LPL").replace("Pakistan Super League", "PSL")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-orange-400 font-bold text-xs">{player.performance_score.toFixed(2)}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-blue-400 text-xs">{player.marker_score}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`text-xs font-bold ${getTierColor(tier)}`}>{tier}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {player.was_selected
                          ? <span className="text-emerald-400 text-xs font-bold">✓</span>
                          : <span className="text-slate-600 text-xs">—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Player Detail */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
          {selectedPlayer ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Player Profile</h3>
                <button
                  onClick={() => toggleFavoritePlayer(selectedPlayer.player_name)}
                  className={`text-lg transition-all ${userPrefs.favoritePlayers.includes(selectedPlayer.player_name) ? "text-yellow-400" : "text-slate-600 hover:text-yellow-400"}`}
                >
                  ★
                </button>
              </div>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-3xl mx-auto">
                  {roleIcons[selectedPlayer.role]}
                </div>
                <h4 className="text-white font-bold">{selectedPlayer.player_name}</h4>
                <p className="text-slate-400 text-xs">{selectedPlayer.role} · {selectedPlayer.team}</p>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                  selectedPlayer.was_selected
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-700/50 border-slate-600 text-slate-400"
                }`}>
                  {selectedPlayer.was_selected ? "✅ IPL Selected" : "⏳ Not Selected"}
                </span>
              </div>

              {/* Radar Chart */}
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Performance Score</span>
                  <span className="text-orange-400 font-bold text-sm">{selectedPlayer.performance_score.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Marker Score</span>
                  <span className="text-blue-400 font-bold text-sm">{selectedPlayer.marker_score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Tournament</span>
                  <span className="text-slate-300 text-xs">{selectedPlayer.tournament}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">IPL Probability</span>
                  <span className="text-purple-400 font-bold text-sm">{(getIPLProbability(selectedPlayer) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {selectedPlayer.awards.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Awards</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlayer.awards.map(a => (
                      <span key={a} className="text-[10px] px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">🏆 {a}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-700/50 pt-3">
                <p className="text-slate-400 text-xs uppercase tracking-wider">News Coverage</p>
                {selectedPlayer.news.map((n, i) => (
                  <p key={i} className="text-slate-300 text-xs leading-relaxed border-l-2 border-orange-500/40 pl-2">{n}</p>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
              <span className="text-5xl opacity-30">📊</span>
              <p className="text-slate-400 text-sm">Click on a player to view their full performance profile</p>
              <p className="text-slate-600 text-xs">Including radar chart, news coverage, and IPL probability</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
