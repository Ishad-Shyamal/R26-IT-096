import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import NewsFeed from "./NewsFeed";

const API_IPL_PREDICTIONS_URL = "http://127.0.0.1:5001/players-predictions";

type PlayerData = Record<string, any>;

// Message type එක multi-player array (playersList) සහ text header support වන ලෙස update කර ඇත
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
    text: "Welcome to CricketIQ! Type a player's name (e.g., Zakir Hasan, Mominul Haque) or a country (e.g., Sri Lanka) to view real-time intelligence & performance insights.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

export default function QueryEngine() {
  const [history, setHistory] = useState<Message[]>(initialHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [localInput, setLocalInput] = useState("");
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

        // 1. Exact or Full Name Match Check
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

        // 2. Country / Team / Partial Name Multi-match Filter
        const matches = data.filter((p: any) => {
          const pName = (p.player_name || p.name || p.player || p.PlayerName || "").toLowerCase();
          const country = (p.country || p.Country || p.team || p.Team || "").toLowerCase();
          return country.includes(queryLower) || pName.includes(queryLower);
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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg">🏏</div>
        <div>
          <h2 className="text-white font-bold text-xl">Player Search & Intelligence</h2>
          <p className="text-slate-400 text-sm">Search any player or country to get performance score, prediction, and recent insights</p>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] md:max-w-[80%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                {msg.role === "system" && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs">🤖</div>
                    <span className="text-slate-500 text-xs">CricketIQ · {msg.time}</span>
                  </div>
                )}
                
                {msg.role === "user" && (
                  <div className="bg-orange-500/20 border border-orange-500/40 text-orange-100 rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                    {msg.text}
                  </div>
                )}

                {msg.role === "system" && msg.text && !msg.playersList && (
                  <div className="bg-slate-700/60 border border-slate-600/50 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                    {msg.text}
                  </div>
                )}

                {/* Single Player Result Rendering */}
                {msg.role === "system" && msg.playerData && (
                  <PlayerCard player={msg.playerData} />
                )}

                {/* Multi-Player Result Rendering (Country/Team Search Output) */}
                {msg.role === "system" && msg.playersList && (
                  <div className="space-y-4">
                    {msg.text && (
                      <div className="bg-slate-700/60 border border-slate-600/50 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm font-medium">
                        {msg.text}
                      </div>
                    )}
                    <div className="space-y-3">
                      {msg.playersList.map((player, pIdx) => (
                        <PlayerCard key={pIdx} player={player} />
                      ))}
                    </div>
                  </div>
                )}

                {msg.role === "system" && msg.notFoundName && (
                  <div className="bg-slate-700/60 border border-slate-600/50 text-slate-300 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                    ⚠️ Player or Country <span className="text-orange-400 font-semibold">"{msg.notFoundName}"</span> was not found in the dataset.
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/60 border border-slate-600/50 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-400 text-xs animate-pulse">
                Searching dataset for player metrics & matches...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-700/50 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter player name or country (e.g. Sri Lanka, Zakir Hasan)..."
              value={localInput}
              onChange={e => setLocalInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleQuery();
                }
              }}
              className="flex-1 bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={() => handleQuery()}
              disabled={!localInput.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: PlayerData }) {
  const name = player.player_name || player.name || player.PlayerName || "Unknown Player";
  const role = player.role || player.Role || player.player_role || "N/A";
  const country = player.country || player.Country || player.team || "N/A";
  const status = player.status || player.domestic_status || "domestic only status in dataset context";

  const tier = player.tier || player.Tier || player.category || "Elite";
  const isNational = player.is_national ?? player.national_selection ?? player.isNational ?? player.was_selected ?? false;

  // 1. Performance Score Fallbacks
  const rawPerfScore = player.perf_score ?? player.performance_score ?? player.score ?? player.PerfScore ?? player.performance_metric;
  const perfScore = rawPerfScore !== undefined && rawPerfScore !== null ? Number(rawPerfScore).toFixed(2) : "N/A";

  // 2. Marker Score Fallbacks
  const rawMarker = 
    player.marker ?? 
    player.Marker ?? 
    player.marker_score ?? 
    player.markerScore ?? 
    player.runs ?? 
    player.wickets ?? 
    player.rating ?? 
    player.nlp_score;

  const marker = rawMarker !== undefined && rawMarker !== null && rawMarker !== ""
    ? typeof rawMarker === "number" ? rawMarker.toFixed(2) : rawMarker
    : "N/A";

  // 3. National Probability Fallbacks & Percentage Normalization
  const rawProb = 
    player.national_prob ?? 
    player.NationalProb ?? 
    player.nationalProb ?? 
    player.probability ?? 
    player.Probability ?? 
    player.ipl_prediction ?? 
    player.prediction ?? 
    player.iplProb;

  let nationalProb = "N/A";
  if (typeof rawProb === "number") {
    const val = rawProb <= 1 ? rawProb * 100 : rawProb;
    nationalProb = `${val.toFixed(0)}%`;
  } else if (typeof rawProb === "string" && rawProb.trim() !== "") {
    nationalProb = rawProb.includes("%") ? rawProb : `${rawProb}%`;
  }

  // Extract news text
  const newsText = player.news || player.recent_news || player.News || player.news_insight || player.summary;

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-4 text-slate-200 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h3 className="text-lg font-bold text-white">{name}</h3>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">({status})</p>
          <p className="text-slate-300 text-sm font-medium mt-1">
            {role} · <span className="text-slate-400">{country}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
            {tier}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${isNational ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>
            {isNational ? "National ✓" : "Domestic"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center">
        <div>
          <p className="text-lg font-bold text-orange-400">{perfScore}</p>
          <p className="text-slate-400 text-[11px]">Perf Score</p>
        </div>
        <div>
          <p className="text-lg font-bold text-violet-400">{marker}</p>
          <p className="text-slate-400 text-[11px]">Marker</p>
        </div>
        <div>
          <p className="text-lg font-bold text-emerald-400">{nationalProb}</p>
          <p className="text-slate-400 text-[11px]">National Prob</p>
        </div>
      </div>

      {/* Linked NewsFeed Component with Props Pass */}
      <NewsFeed newsText={Array.isArray(newsText) ? newsText[0] : newsText} playerName={name} />
    </div>
  );
}