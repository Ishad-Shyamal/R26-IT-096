import React, { useEffect, useState } from "react";
// @ts-ignore
import ReactMarkdown from "react-markdown";

interface Player {
  player_name: string;
  role: string;
  team: string;
  performance_score: number;
  marker_score: number;
  news: string[];
  awards: string[];
}

interface Props {
  player: Player | null;
  onClose: () => void;
}

export default function PlayerProfileModal({ player, onClose }: Props) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (player?.player_name) {
      setLoading(true);
      fetch(`http://localhost:5001/player-summary/${encodeURIComponent(player.player_name)}`)
        .then((res) => res.json())
        .then((data) => {
          setSummary(data.summary || "");
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching summary:", err);
          setLoading(false);
        });
    }
  }, [player]);

  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">G</span>
            <span>AI Player Intelligence Profile</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full text-xs">
            ✕
          </button>
        </div>

        {/* Player Header Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl border border-slate-700">
              🏏
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{player.player_name}</h2>
              <p className="text-slate-400 text-xs mt-0.5">{player.role} • {player.team}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] rounded-md font-semibold">
                  Perf: {player.performance_score}
                </span>
                <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] rounded-md font-semibold">
                  Marker: {player.marker_score}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Gemini AI Overview Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            ✨ Dynamic Career & Sentiment Insights (Gemini AI)
          </h3>
          
          {loading ? (
            <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
              Analyzing stats & extracting news NLP overview...
            </div>
          ) : summary ? (
            <div className="text-slate-300 text-xs leading-relaxed">
              <ReactMarkdown 
                components={{
                  h3: ({ ...props }: any) => <h3 className="text-sm font-bold text-slate-100 mt-3 mb-1" {...props} />,
                  ul: ({ ...props }: any) => <ul className="list-disc pl-5 space-y-1 text-slate-300 my-2" {...props} />,
                  li: ({ ...props }: any) => <li className="leading-relaxed" {...props} />,
                  strong: ({ ...props }: any) => <strong className="font-semibold text-slate-100" {...props} />
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Overview unavailable.</p>
          )}
        </div>

        {/* News Snippets */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About & Articles</h4>
          {player.news && player.news.map((n, idx) => (
            <div key={idx} className="text-slate-300 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
              {n}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500">
          <span>Search powered view</span>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(player.player_name + " cricket profile")}`}
            target="_blank"
            rel="noreferrer"
            className="text-orange-400 hover:underline font-medium"
          >
            Open in Google Search ↗
          </a>
        </div>

      </div>
    </div>
  );
}