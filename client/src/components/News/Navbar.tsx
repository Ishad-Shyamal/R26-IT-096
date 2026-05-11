import { useApp } from "../context/AppContext";
import type { Tab } from "../context/AppContext";

const tabs: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: "feed", label: "News Feed", icon: "📰", desc: "Personalized" },
  { id: "intelligence", label: "Performance Intelligence", icon: "📊", desc: "Player Insights" },
  { id: "prediction", label: "IPL Prediction", icon: "🏏", desc: "Selection Forecast" },
  { id: "query", label: "Query Engine", icon: "🔍", desc: "Ask Cricket AI" },
];

export default function Navbar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <header className="bg-slate-900 border-b border-slate-700/60 sticky top-0 z-50 shadow-xl shadow-black/20">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg shadow-lg">
            🏏
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-tight">CricketIQ</h1>
            <p className="text-slate-400 text-xs mt-0.5">Intelligent Cricket News Module</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium">
            Live Season
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-medium">
            100 Players
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[140px] flex flex-col items-center gap-1 py-3 px-4 text-center transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs font-semibold leading-none">{tab.label}</span>
            <span className="text-[10px] leading-none opacity-70">{tab.desc}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
