import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import NewsFeed from "./NewsFeed";
import PlayerValidationModal from "./PlayerValidationModal"; 

const API_IPL_PREDICTIONS_URL = "http://127.0.0.1:5001/players-predictions";

type PlayerData = Record<string, any>;

type Message = {
  role: "user" | "system";
  text?: string;
  playerData?: PlayerData | null;
  playersList?: PlayerData[];
  notFoundName?: string;
  time: string;
};

const initialHistory: Message[] = [
  {
    role: "system",
    text: "Welcome to CricketIQ! Search by player name (e.g., Zakir Hasan) or country (e.g., Sri Lanka) to evaluate selection probabilities and news intelligence.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

const QUICK_SUGGESTIONS = ["Sri Lanka", "Bangladesh", "Australia", "India", "Pakistan", "Zakir Hasan", "Babar Azam", "Virat Kohli", "Rashid Khan"];

export default function QueryEngine() {
  const [history, setHistory] = useState<Message[]>(initialHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const [selectedPlayerForModal, setSelectedPlayerForModal] = useState<PlayerData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const handleQuery = useCallback(async (q?: string) => {
    const text = (q || localInput).trim();
    if (!text || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setHistory(prev => [
      ...prev,
      { role: "user", text, time: currentTime },
    ]);

    setLocalInput("");
    setIsLoading(true);

    try {
      const response = await axios.get(API_IPL_PREDICTIONS_URL);
      const data = response.data;

      if (Array.isArray(data)) {
        const queryLower = text.toLowerCase();

        // 1. Exact Name Check
        const exactPlayerMatches = data.filter((p: any) => {
          const pName = (p.player_name || p.name || p.player || p.PlayerName || "").toLowerCase();
          return pName === queryLower;
        });

        if (exactPlayerMatches.length === 1) {
          setHistory(prev => [
            ...prev,
            {
              role: "system",
              playerData: exactPlayerMatches[0],
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }

        // 2. Partial Search / Team Matching
        const matches = data.filter((p: any) => {
          const pName = (p.player_name || p.name || p.player || p.PlayerName || "").toLowerCase();
          const country = (p.country || p.Country || p.team || p.Team || "").toLowerCase();
          const role = (p.role || "").toLowerCase();
          return country.includes(queryLower) || pName.includes(queryLower) || role.includes(queryLower);
        });

        if (matches.length > 0) {
          if (matches.length === 1) {
            setHistory(prev => [
              ...prev,
              {
                role: "system",
                playerData: matches[0],
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          } else {
            setHistory(prev => [
              ...prev,
              {
                role: "system",
                playersList: matches,
                text: `Found ${matches.length} player(s) for "${text}":`,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
          }
        } else {
          setHistory(prev => [
            ...prev,
            {
              role: "system",
              notFoundName: text,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching player details:", error);
      setHistory(prev => [
        ...prev,
        {
          role: "system",
          text: `⚠️ Backend Error: Unable to fetch data from 127.0.0.1:5001 (${error?.message || "Network Error"})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [localInput, isLoading]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Modal Integration */}
      {selectedPlayerForModal && (
        <PlayerValidationModal 
          player={selectedPlayerForModal} 
          onClose={() => setSelectedPlayerForModal(null)} 
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg shadow-md">🏏</div>
        <div>
          <h2 className="text-white font-bold text-xl">Player Search & Intelligence Engine</h2>
          <p className="text-slate-400 text-sm">Query individual candidates or national pools for Explainable AI breakdowns</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[92%] md:max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                {msg.role === "system" && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs">🤖</div>
                    <span className="text-slate-500 text-xs">CricketIQ Engine · {msg.time}</span>
                  </div>
                )}
                
                {msg.role === "user" && (
                  <div className="bg-orange-500/20 border border-orange-500/40 text-orange-100 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm font-medium">
                    {msg.text}
                  </div>
                )}

                {msg.role === "system" && msg.text && !msg.playersList && (
                  <div className="bg-slate-700/60 border border-slate-600/50 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                    {msg.text}
                  </div>
                )}

                {/* Single Player Card */}
                {msg.role === "system" && msg.playerData && (
                  <PlayerCard 
                    player={msg.playerData} 
                    onOpenValidation={(p) => setSelectedPlayerForModal(p)} 
                  />
                )}

                {/* Multi Player List */}
                {msg.role === "system" && msg.playersList && (
                  <div className="space-y-3">
                    {msg.text && (
                      <div className="bg-slate-700/60 border border-slate-600/50 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm font-medium">
                        {msg.text}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
                      {msg.playersList.map((player, pIdx) => (
                        <PlayerCard 
                          key={pIdx} 
                          player={player} 
                          onOpenValidation={(p) => setSelectedPlayerForModal(p)} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Not Found Output */}
                {msg.role === "system" && msg.notFoundName && (
                  <div className="bg-slate-700/60 border border-slate-600/50 text-slate-300 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                    ⚠️ Candidate or Country <span className="text-orange-400 font-semibold">"{msg.notFoundName}"</span> was not found in active national pool datasets.
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/60 border border-slate-600/50 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-400 text-xs animate-pulse">
                Evaluating feature interactions & executing model inference...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Suggestion Bar */}
        <div className="border-t border-slate-700/50 p-4 space-y-3 bg-slate-900/40">
          {/* Quick Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium shrink-0">Try searching:</span>
            {QUICK_SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuery(chip)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg shrink-0 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter player name or country (e.g., Sri Lanka, Zakir Hasan)..."
              value={localInput}
              onChange={e => setLocalInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleQuery();
                }
              }}
              className="flex-1 bg-slate-900/80 border border-slate-600/80 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
            />
            <button
              onClick={() => handleQuery()}
              disabled={!localInput.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all shadow-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced PlayerCard Sub-component
function PlayerCard({ player, onOpenValidation }: { player: PlayerData; onOpenValidation: (p: PlayerData) => void }) {
  const name = player.player_name || player.name || player.PlayerName || "Unknown Candidate";
  const role = player.role || player.Role || "Player";
  const country = player.country || player.Country || player.team || "National Pool";
  
  const isNational = player.is_national ?? player.was_selected ?? false;

  // 1. Metrics Extraction
  const rawPerf = player.performance_score ?? player.perf_score ?? 0;
  const perfScore = Number(rawPerf).toFixed(1);

  const rawMarker = player.marker_score ?? player.marker ?? 0;
  const markerScore = Number(rawMarker).toFixed(1);

  const rawGeoRisk = player.geopolitical_risk ?? 0;
  const geoRisk = Number(rawGeoRisk).toFixed(2);

  const rawProb = player.iplProb ?? player.nationalProb ?? player.IPL_select_probability ?? player.probability ?? 0.5;
  const probPercent = (Number(rawProb) * 100).toFixed(1) + "%";

  const newsText = player.news || player.recent_news || player.news_insight;

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-3.5 text-slate-200 shadow-xl relative">
      {/* Top Details */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">{name}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isNational ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
              {isNational ? "Selected ✓" : "Domestic"}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            {role} • <span className="text-slate-300 font-medium">{country}</span>
          </p>
        </div>

        {/* Explainability Action Trigger */}
        <button
          onClick={() => onOpenValidation(player)}
          className="text-xs bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
        >
          🔍 Validation Modal
        </button>
      </div>

      {/* 4 Feature Metrics Bar */}
      <div className="grid grid-cols-4 gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-center">
        <div>
          <span className="text-slate-400 block text-[10px]">Perf Score</span>
          <span className="text-orange-400 font-extrabold text-xs sm:text-sm">{perfScore}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Marker</span>
          <span className="text-cyan-400 font-extrabold text-xs sm:text-sm">{markerScore}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Geo Risk</span>
          <span className="text-purple-400 font-extrabold text-xs sm:text-sm">{geoRisk}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Model Prob</span>
          <span className="text-emerald-400 font-extrabold text-xs sm:text-sm">{probPercent}</span>
        </div>
      </div>

      {/* Linked News Feed */}
      {newsText && (
        <NewsFeed newsText={Array.isArray(newsText) ? newsText[0] : newsText} playerName={name} />
      )}
    </div>
  );
}