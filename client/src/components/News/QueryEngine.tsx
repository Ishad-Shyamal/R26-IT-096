import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext";

const exampleQueries = [
  { label: "Man of the Match", icon: "🏆", query: "Man of Match" },
  { label: "Best Bowlers", icon: "⚡", query: "Best Bowler" },
  { label: "IPL Selected Players", icon: "✅", query: "IPL Selection" },
  { label: "Top Performers", icon: "🌟", query: "Top Performers" },
  { label: "Ranji Trophy Stars", icon: "🏏", query: "Ranji Trophy" },
  { label: "LPL Highlights", icon: "🌴", query: "LPL Lanka" },
  { label: "PSL Coverage", icon: "🌙", query: "PSL Pakistan" },
  { label: "Wicket Milestones", icon: "🎯", query: "Wicket Milestone" },
];

type Message = { role: "user" | "system"; text: string; time: string };

const initialHistory: Message[] = [
  {
    role: "system",
    text: "Welcome to CricketIQ Query Engine! I can answer questions about player performances, IPL selection probabilities, tournament statistics, and news-extracted insights. Try asking about 'Man of the Match', 'Best Bowler', 'IPL Selection', or any player name.",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

export default function QueryEngine() {
  const { setQueryInput, queryResult, runQuery } = useApp();
  const [history, setHistory] = useState<Message[]>(initialHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const resultHandledRef = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  useEffect(() => {
    if (queryResult && queryResult !== resultHandledRef.current) {
      resultHandledRef.current = queryResult;
      setIsLoading(false);
      setHistory(prev => [
        ...prev,
        {
          role: "system",
          text: queryResult,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [queryResult]);

  const handleQuery = useCallback((q?: string) => {
    const text = q || localInput;
    if (!text.trim()) return;
    setHistory(prev => [...prev, {
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setQueryInput(text);
    setLocalInput("");
    setIsLoading(true);
    setTimeout(() => { runQuery(); }, 500);
  }, [localInput, setQueryInput, runQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg">🔍</div>
        <div>
          <h2 className="text-white font-bold text-xl">Cricket Intelligence Query Engine</h2>
          <p className="text-slate-400 text-sm">Ask natural language questions about player performance, IPL selection, and news insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Conversation */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-scroll">
              {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                    {msg.role === "system" && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs">🤖</div>
                        <span className="text-slate-500 text-xs">CricketIQ · {msg.time}</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user"
                          ? "bg-orange-500/20 border border-orange-500/40 text-orange-100 rounded-tr-sm"
                          : "bg-slate-700/60 border border-slate-600/50 text-slate-200 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <p className="text-slate-500 text-xs text-right mt-1">{msg.time}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/60 border border-slate-600/50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span className="text-slate-400 text-xs ml-2">Analyzing cricket data...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-700/50 p-4">
              <div className="flex gap-3 items-end">
                <textarea
                  rows={2}
                  placeholder="Ask about players, performances, IPL selection, tournaments..."
                  value={localInput}
                  onChange={e => setLocalInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleQuery();
                    }
                  }}
                  className="flex-1 bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500/60 resize-none leading-relaxed"
                />
                <button
                  onClick={() => handleQuery()}
                  disabled={!localInput.trim() || isLoading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  Send
                </button>
              </div>
              <p className="text-slate-600 text-xs mt-2">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>

          {/* Quick Query Suggestions */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Quick Queries</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {exampleQueries.map(q => (
                <button
                  key={q.label}
                  onClick={() => handleQuery(q.query)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs hover:bg-slate-700 hover:border-slate-500 transition-all text-left group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Capabilities + Stats */}
        <div className="space-y-4">
          {/* Query Capabilities */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-white font-semibold text-sm">Query Capabilities</h3>
            <div className="space-y-3">
              {[
                { icon: "🏆", title: "Award Extraction", desc: "Man of Match, Best Bowler, Wicket Milestones from news" },
                { icon: "📊", title: "Performance Profiles", desc: "Season stats, composite scores, tier classification" },
                { icon: "🎯", title: "IPL Selection", desc: "Probability scores, predicted vs actual selection" },
                { icon: "🌍", title: "Tournament Coverage", desc: "Ranji Trophy, Lanka Premier League, PSL insights" },
                { icon: "👤", title: "Player Lookup", desc: "Individual profiles with news and award history" },
                { icon: "📈", title: "Rankings", desc: "Top performers by performance and marker scores" },
              ].map(cap => (
                <div key={cap.title} className="flex gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-700/50">
                  <span className="text-xl flex-shrink-0">{cap.icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{cap.title}</p>
                    <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Stats */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-semibold text-sm">Dataset Overview</h3>
            <div className="space-y-2.5">
              {[
                { label: "Total Records", value: "100 Players" },
                { label: "Features", value: "5 Columns" },
                { label: "Tournaments", value: "3 Leagues" },
                { label: "Performance Range", value: "0.04 – 9.97" },
                { label: "Marker Range", value: "0 – 5" },
                { label: "Selection Rate", value: "50%" },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center border-b border-slate-700/30 pb-2">
                  <span className="text-slate-400 text-xs">{stat.label}</span>
                  <span className="text-white text-xs font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Queries */}
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-4 space-y-2">
            <h3 className="text-violet-300 font-semibold text-sm">💡 Example Queries</h3>
            <ul className="space-y-1.5">
              {[
                '"Who won Man of the Match?"',
                '"Show me IPL selected players"',
                '"Top performers in Ranji"',
                '"Best bowlers this season"',
                '"LPL highlights"',
                '"Wicket milestones"',
              ].map(q => (
                <li key={q} className="text-violet-200 text-xs italic opacity-80">{q}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
