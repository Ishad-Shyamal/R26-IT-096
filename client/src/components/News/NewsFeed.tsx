import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";
import PlayerProfileModal from "./PlayerProfileModal";
import PlayerValidationModal from "./PlayerValidationModal";

const API_URL = "http://127.0.0.1:5001/players-predictions";

const roleIcons: Record<string, string> = {
  "Batsman": "🏏",
  "Batter": "🏏",
  "Bowler": "⚡",
  "All-Rounder": "🌟",
  "Wicket-Keeper": "🧤",
  "Opener": "🚀",
};

export interface NewsFeedProps {
  newsText?: string;
  playerName?: string;
}

const getPerformanceTier = (score: number): string => {
  if (score >= 80) return "Elite";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
};

const getTierColor = (tier: string): string => {
  switch (tier) {
    case "Elite": return "text-emerald-400";
    case "High": return "text-blue-400";
    case "Moderate": return "text-yellow-400";
    default: return "text-slate-400";
  }
};

const getTierBg = (tier: string): string => {
  switch (tier) {
    case "Elite": return "bg-emerald-500/10 border-emerald-500/30";
    case "High": return "bg-blue-500/10 border-blue-500/30";
    case "Moderate": return "bg-yellow-500/10 border-yellow-500/30";
    default: return "bg-slate-500/10 border-slate-500/30";
  }
};

export default function NewsFeed({ newsText, playerName: propPlayerName }: NewsFeedProps) {
  const { engagedArticles, engageArticle, setSelectedPlayer: setCtxPlayer } = useApp();
  const [sortBy, setSortBy] = useState<"performance" | "marker" | "recent">("performance");
  const [selectedCountry, setSelectedCountry] = useState<string>("All Countries");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [dynamicPlayers, setDynamicPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [modalPlayer, setModalPlayer] = useState<any | null>(null);
  const [validationPlayer, setValidationPlayer] = useState<any | null>(null);

  useEffect(() => {
    async function fetchPlayerData() {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);
        setDynamicPlayers(response.data);
      } catch (error) {
        console.error("Error fetching player data from ML API:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlayerData();
  }, []);

  // API එකෙන් එන සියලු රටවල් එකතු කර Dynamic List එකක් සාදාගැනීම
  const countriesList = useMemo(() => {
    const countries = new Set<string>();
    dynamicPlayers.forEach((player) => {
      const country = player.country || player.team;
      if (country) countries.add(country);
    });
    return ["All Countries", ...Array.from(countries).sort()];
  }, [dynamicPlayers]);

  // Country filter & Sorting දෙකම යෙදීම
  const processedPlayers = useMemo(() => {
    let filtered = [...dynamicPlayers];

    if (selectedCountry !== "All Countries") {
      filtered = filtered.filter((player) => {
        const country = player.country || player.team;
        return country?.toLowerCase() === selectedCountry.toLowerCase();
      });
    }

    return filtered.sort((a, b) => {
      const perfA = a.performance_score ?? a.performance_metric ?? 0;
      const perfB = b.performance_score ?? b.performance_metric ?? 0;
      const markA = a.marker_score ?? a.markerScore ?? 0;
      const markB = b.marker_score ?? b.markerScore ?? 0;

      if (sortBy === "marker") return markB - markA;
      return perfB - perfA;
    });
  }, [dynamicPlayers, selectedCountry, sortBy]);

  if (newsText !== undefined || propPlayerName !== undefined) {
    return (
      <div className="flex items-start gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
        <span className="text-base">📰</span>
        <div className="leading-relaxed">
          <strong className="text-slate-300">
            News{propPlayerName ? ` (${propPlayerName})` : ""}:
          </strong>{" "}
          <span>{newsText || "No recent news available in current context."}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <p className="animate-pulse">Loading Live ML Predictions & Player News...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Filters & Country Selection Dropdown Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <p className="text-slate-400 text-sm">
          Showing <span className="text-cyan-400 font-semibold">{processedPlayers.length}</span> players
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Country Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Country:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            >
              {countriesList.map((country) => (
                <option key={country} value={country} className="bg-slate-900 text-slate-200">
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <span className="text-slate-400 text-sm font-medium">Sort:</span>
            {(["performance", "marker", "recent"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                  sortBy === s
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {processedPlayers.map((player) => {
          const playerName = player.player_name ?? player.name ?? player.PlayerName ?? "Unknown Player";
          const perfScore = Number(player.performance_score ?? player.performance_metric ?? player.perf_score ?? 0);
          const markerScore = Number(player.marker_score ?? player.markerScore ?? player.marker ?? 0);
          const rawProb = player.nationalProb ?? player.iplProb ?? player.national_prob ?? (perfScore / 100);
          const nationalProb = Math.min(Math.max(rawProb > 1 ? rawProb / 100 : rawProb, 0), 1);
          
          const tier = player.tier || getPerformanceTier(perfScore);
          const awards: string[] = player.awards || player.nlp_markers || [];
          const newsList: string[] = Array.isArray(player.news)
            ? player.news
            : [player.news_preview || player.summary || player.news || "No recent news available."];

          const isExpanded = expandedCard === playerName;
          const isEngaged = engagedArticles.has(playerName);

          return (
            <div
              key={playerName}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-black/20 hover:border-slate-600"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-lg">
                    {roleIcons[player.role] || "🏏"}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{playerName}</h3>
                    <p className="text-slate-400 text-xs">{player.role || "Player"} · {player.team || player.country || "Domestic"}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getTierBg(tier)} ${getTierColor(tier)}`}>
                    {tier}
                  </span>
                  {(player.was_selected === 1 || player.was_selected === true || player.is_national === true) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-medium">
                      National ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Awards / NLP Badges */}
              {awards.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {awards.slice(0, 2).map((award) => (
                    <span key={award} className="text-[10px] px-2 py-1 rounded-lg border bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
                      🏆 {award}
                    </span>
                  ))}
                </div>
              )}

              {/* API Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900/60 rounded-xl p-2 text-center">
                  <p className="text-orange-400 font-bold text-sm">{perfScore.toFixed(2)}</p>
                  <p className="text-slate-500 text-[10px]">Perf Score</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2 text-center">
                  <p className="text-blue-400 font-bold text-sm">{markerScore.toFixed(2)}</p>
                  <p className="text-slate-500 text-[10px]">Marker</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-2 text-center">
                  <p className="text-purple-400 font-bold text-sm">{(nationalProb * 100).toFixed(0)}%</p>
                  <p className="text-slate-500 text-[10px]">National Prob</p>
                </div>
              </div>

              {/* News Content */}
              <div className="space-y-1.5">
                <p className="text-slate-300 text-xs leading-relaxed">
                  {newsList[0]}
                </p>
                {isExpanded && newsList.slice(1).map((n, i) => (
                  <p key={i} className="text-slate-400 text-xs leading-relaxed border-t border-slate-700/50 pt-1.5">
                    {n}
                  </p>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    engageArticle(playerName);
                    setExpandedCard(isExpanded ? null : playerName);
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
                    setModalPlayer(player);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition-all flex items-center justify-center gap-1"
                >
                  📊 Profile
                </button>

                <button
                  onClick={() => setValidationPlayer(player)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-1"
                >
                  🔍 Validate
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Profile Modal */}
      {modalPlayer && (
        <PlayerProfileModal
          player={modalPlayer}
          onClose={() => setModalPlayer(null)}
        />
      )}

      {/* Dynamic Validation Modal */}
      {validationPlayer && (
        <PlayerValidationModal
          player={validationPlayer}
          onClose={() => setValidationPlayer(null)}
        />
      )}
    </div>
  );
}