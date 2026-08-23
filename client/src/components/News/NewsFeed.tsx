import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { players, getPerformanceTier, getTierColor, getTierBg } from "../data/playersData";
import PlayerProfileModal from "./PlayerProfileModal"; // 👈 1. Custom Modal Component එක Import කළා

const getIPLProbability = (player: typeof players[0]): number => {
  return Math.min(player.performance_score / 100, 1);
};

const roleIcons: Record<string, string> = {
  "Batsman": "🏏",
  "Bowler": "⚡",
  "All-Rounder": "🌟",
  "Wicket-Keeper": "🧤",
  "Opener": "🚀",
};

export default function NewsFeed() {
  const { engagedArticles, engageArticle, setActiveTab, setSelectedPlayer: setCtxPlayer } = useApp();
  const [sortBy, setSortBy] = useState<"performance" | "marker" | "recent">("performance");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // 🎯 Selected Player for Gemini Profile Modal
  const [modalPlayer, setModalPlayer] = useState<typeof players[0] | null>(null);

  const processedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortBy === "marker") return b.marker_score - a.marker_score;
      return b.performance_score - a.performance_score;
    });
  }, [sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-400 text-sm">
          Showing <span className="text-white font-medium">{processedPlayers.length}</span> articles
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Sort:</span>
          {(["performance", "marker", "recent"] as const).map(s => (
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

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {processedPlayers.map(player => {
          const tier = getPerformanceTier(player.performance_score);
          const prob = getIPLProbability(player);
          const isExpanded = expandedCard === player.player_name;
          const isEngaged = engagedArticles.has(player.player_name);
          return (
            <div
              key={player.player_name}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-black/20 hover:border-slate-600"
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
                      National ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Awards Badges */}
              {player.awards.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {player.awards.slice(0, 2).map(award => (
                    <span key={award} className="text-[10px] px-2 py-1 rounded-lg border bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
                      🏆 {award}
                    </span>
                  ))}
                </div>
              )}

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
                  <p className="text-slate-500 text-[10px]">National Prob</p>
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
                
                {/* Profile Button */}
                <button
                  onClick={() => {
                    setCtxPlayer(player);
                    setModalPlayer(player);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition-all flex items-center justify-center gap-1"
                >
                  📊 Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎯 2. Import කළ PlayerProfileModal Component එක Render කිරීම */}
      {modalPlayer && (
        <PlayerProfileModal
          player={modalPlayer}
          onClose={() => setModalPlayer(null)}
        />
      )}
    </div>
  );
}