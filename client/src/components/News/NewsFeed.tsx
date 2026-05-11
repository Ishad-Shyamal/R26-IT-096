import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { players, getPerformanceTier, getTierColor, getTierBg, getIPLProbability } from "../data/playersData";

const tournamentColors: Record<string, string> = {
  "Ranji Trophy": "bg-blue-500/20 border-blue-500/40 text-blue-300",
  "Lanka Premier League": "bg-purple-500/20 border-purple-500/40 text-purple-300",
  "Pakistan Super League": "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
};

const roleIcons: Record<string, string> = {
  "Batsman": "🏏",
  "Bowler": "⚡",
  "All-Rounder": "🌟",
  "Wicket-Keeper": "🧤",
  "Opener": "🚀",
};

export default function NewsFeed() {
  const { userPrefs, toggleFavoriteTeam, toggleTournament, engagedArticles, engageArticle, setActiveTab, setSelectedPlayer: setCtxPlayer } = useApp();
  const [filterTournament, setFilterTournament] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"relevance" | "performance" | "recent">("relevance");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const allTournaments = ["All", "Ranji Trophy", "Lanka Premier League", "Pakistan Super League"];

  // Hybrid recommendation: boost favorite teams, favorite players, engaged articles
  const scoredPlayers = useMemo(() => {
    return players
      .filter(p => filterTournament === "All" || p.tournament === filterTournament)
      .map(p => {
        let relevance = p.performance_score;
        if (userPrefs.favoriteTeams.includes(p.team)) relevance += 3;
        if (userPrefs.favoritePlayers.includes(p.player_name)) relevance += 5;
        if (userPrefs.preferredTournaments.includes(p.tournament)) relevance += 1;
        if (engagedArticles.has(p.player_name)) relevance += 2;
        return { ...p, relevance };
      })
      .sort((a, b) => {
        if (sortBy === "relevance") return b.relevance - a.relevance;
        if (sortBy === "performance") return b.performance_score - a.performance_score;
        return b.marker_score - a.marker_score;
      });
  }, [filterTournament, sortBy, userPrefs, engagedArticles]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Preferences Panel */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 text-lg">⚙️</span>
          <h2 className="text-white font-semibold">Personalization Settings</h2>
          <span className="ml-auto text-xs text-slate-400">Hybrid Recommendation Active</span>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-medium">Favorite IPL Teams</p>
          <div className="flex flex-wrap gap-2">
            {["Mumbai Indians","Chennai Super Kings","Royal Challengers","Delhi Capitals","Rajasthan Royals","Kolkata Knight Riders","Punjab Kings","Sunrisers Hyderabad"].map(team => (
              <button
                key={team}
                onClick={() => toggleFavoriteTeam(team)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  userPrefs.favoriteTeams.includes(team)
                    ? "bg-orange-500/30 border-orange-500/60 text-orange-300"
                    : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:border-slate-500"
                }`}
              >
                {userPrefs.favoriteTeams.includes(team) ? "★ " : "☆ "}{team}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider font-medium">Preferred Tournaments</p>
          <div className="flex flex-wrap gap-2">
            {["Ranji Trophy","Lanka Premier League","Pakistan Super League"].map(t => (
              <button
                key={t}
                onClick={() => toggleTournament(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  userPrefs.preferredTournaments.includes(t)
                    ? "bg-blue-500/30 border-blue-500/60 text-blue-300"
                    : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:border-slate-500"
                }`}
              >
                {userPrefs.preferredTournaments.includes(t) ? "✓ " : "+ "}{t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {allTournaments.map(t => (
            <button
              key={t}
              onClick={() => setFilterTournament(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                filterTournament === t
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-400 text-sm">Sort:</span>
          {(["relevance","performance","recent"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                sortBy === s
                  ? "bg-slate-600 border-slate-500 text-white"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-slate-400 text-sm">
        Showing <span className="text-white font-medium">{scoredPlayers.length}</span> articles · 
        <span className="text-orange-400 ml-1">Personalized for your preferences</span>
      </p>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {scoredPlayers.map(player => {
          const tier = getPerformanceTier(player.performance_score);
          const prob = getIPLProbability(player);
          const isExpanded = expandedCard === player.player_name;
          const isEngaged = engagedArticles.has(player.player_name);
          return (
            <div
              key={player.player_name}
              className={`bg-slate-800/60 border rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-black/20 ${
                userPrefs.favoriteTeams.includes(player.team)
                  ? "border-orange-500/40 hover:border-orange-500/60"
                  : "border-slate-700/60 hover:border-slate-600"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-lg">
                    {roleIcons[player.role] || "🏏"}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{player.player_name}</h3>
                    <p className="text-slate-400 text-xs">{player.role} · {player.team}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getTierBg(tier)} ${getTierColor(tier)}`}>
                    {tier}
                  </span>
                  {player.was_selected === 1 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-medium">
                      IPL ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Tournament Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] px-2 py-1 rounded-lg border font-medium ${tournamentColors[player.tournament]}`}>
                  {player.tournament}
                </span>
                {player.awards.slice(0, 2).map(award => (
                  <span key={award} className="text-[10px] px-2 py-1 rounded-lg border bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
                    🏆 {award}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900/60 rounded-xl p-2 text-center">
                  <p className="text-orange-400 font-bold text-sm">{player.performance_score.toFixed(2)}</p>
                  <p className="text-slate-500 text-[10px]">Perf Score</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2 text-center">
                  <p className="text-blue-400 font-bold text-sm">{player.marker_score}</p>
                  <p className="text-slate-500 text-[10px]">Marker</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2 text-center">
                  <p className="text-purple-400 font-bold text-sm">{(prob * 100).toFixed(0)}%</p>
                  <p className="text-slate-500 text-[10px]">IPL Prob</p>
                </div>
              </div>

              {/* News Preview */}
              <div className="space-y-1.5">
                <p className="text-slate-300 text-xs leading-relaxed">
                  {player.news[0]}
                </p>
                {isExpanded && player.news.slice(1).map((n, i) => (
                  <p key={i} className="text-slate-400 text-xs leading-relaxed border-t border-slate-700/50 pt-1.5">
                    {n}
                  </p>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    engageArticle(player.player_name);
                    setExpandedCard(isExpanded ? null : player.player_name);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                    isEngaged
                      ? "bg-blue-500/20 border border-blue-500/40 text-blue-400"
                      : "bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {isExpanded ? "Show Less" : "Read More"} {isEngaged && "✓"}
                </button>
                <button
                  onClick={() => {
                    setCtxPlayer(player);
                    setActiveTab("intelligence");
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition-all"
                >
                  📊 Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
