import React, { createContext, useContext, useState, useCallback } from "react";
import { players, Player, teams } from "../data/playersData";

// 1. "intelligence" කියන Tab Type එක මෙතනට ඇතුලත් කර ඇත
export type Tab = "feed" | "prediction" | "intelligence" | "query";

interface UserPrefs {
  favoriteTeams: string[];
  favoritePlayers: string[];
}

interface AppContextType {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  userPrefs: UserPrefs;
  toggleFavoriteTeam: (team: string) => void;
  toggleFavoritePlayer: (name: string) => void;
  filteredPlayers: Player[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  queryInput: string;
  setQueryInput: (q: string) => void;
  queryResult: string;
  runQuery: () => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (p: Player | null) => void;
  engagedArticles: Set<string>;
  engageArticle: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("prediction"); // Default tab එක prediction ලෙස තබා ඇත
  const [userPrefs, setUserPrefs] = useState<UserPrefs>({
    favoriteTeams: ["Sri Lanka", "Kandy Falcons"],
    favoritePlayers: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [engagedArticles, setEngagedArticles] = useState<Set<string>>(new Set());

  const toggleFavoriteTeam = useCallback((team: string) => {
    setUserPrefs(prev => ({
      ...prev,
      favoriteTeams: prev.favoriteTeams.includes(team)
        ? prev.favoriteTeams.filter(t => t !== team)
        : [...prev.favoriteTeams, team],
    }));
  }, []);

  const toggleFavoritePlayer = useCallback((name: string) => {
    setUserPrefs(prev => ({
      ...prev,
      favoritePlayers: prev.favoritePlayers.includes(name)
        ? prev.favoritePlayers.filter(p => p !== name)
        : [...prev.favoritePlayers, name],
    }));
  }, []);

  const engageArticle = useCallback((id: string) => {
    setEngagedArticles(prev => new Set([...prev, id]));
  }, []);

  const filteredPlayers = players.filter(p => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return p.player_name.toLowerCase().includes(q) ||
      p.team.toLowerCase().includes(q) ||
      p.tournament.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q);
  });

  const runQuery = useCallback(() => {
    const q = queryInput.toLowerCase().trim();
    if (!q) { setQueryResult("Please enter a query."); return; }

    // Man of Match queries
    if (q.includes("man of match") || q.includes("mom")) {
      const motm = players.filter(p => p.awards.includes("Man of the Match"))
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 5);
      if (motm.length === 0) { setQueryResult("No Man of the Match data found."); return; }
      setQueryResult(`🏆 Man of the Match performers:\n` + motm.map(p =>
        `• ${p.player_name} (${p.tournament}) — Score: ${p.performance_score.toFixed(2)}`).join("\n"));
      return;
    }

    // Best bowler
    if (q.includes("best bowler") || q.includes("bowler")) {
      const bowlers = players.filter(p => p.role === "Bowler" || p.awards.includes("Best Bowler"))
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 5);
      setQueryResult(`🎯 Top Bowlers this season:\n` + bowlers.map(p =>
        `• ${p.player_name} (${p.team}) — Perf: ${p.performance_score.toFixed(2)}, Marker: ${p.marker_score}`).join("\n"));
      return;
    }

    // National selection queries
    if (q.includes("national") || q.includes("selection") || q.includes("selected") || q.includes("ipl")) {
      const selected = players.filter(p => p.was_selected === 1)
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 8);
      setQueryResult(`✅ Players predicted/selected for National Team (${selected.length} shown):\n` + selected.map(p =>
        `• ${p.player_name} — ${p.tournament} | Score: ${p.performance_score.toFixed(2)}`).join("\n"));
      return;
    }

    // Top performers / elite
    if (q.includes("top") || q.includes("elite") || q.includes("best")) {
      const top = players.sort((a, b) => b.performance_score - a.performance_score).slice(0, 8);
      setQueryResult(`🌟 Top Performers across all tournaments:\n` + top.map(p =>
        `• ${p.player_name} (${p.tournament}) — Score: ${p.performance_score.toFixed(2)}`).join("\n"));
      return;
    }

    // Player-specific query
    const matchedPlayer = players.find(p => p.player_name.toLowerCase().includes(q));
    if (matchedPlayer) {
      setQueryResult(
        `📊 Profile: ${matchedPlayer.player_name}\n` +
        `Tournament: ${matchedPlayer.tournament}\n` +
        `Team: ${matchedPlayer.team}\n` +
        `Role: ${matchedPlayer.role}\n` +
        `Performance Score: ${matchedPlayer.performance_score.toFixed(3)}\n` +
        `Marker Score: ${matchedPlayer.marker_score}\n` +
        `National Team Selected: ${matchedPlayer.was_selected ? "✅ Yes" : "❌ No"}\n` +
        `Awards: ${matchedPlayer.awards.length > 0 ? matchedPlayer.awards.join(", ") : "None recorded"}\n\n` +
        `Latest News:\n${matchedPlayer.news.map(n => `• ${n}`).join("\n")}`
      );
      return;
    }

    // Wicket milestone
    if (q.includes("wicket")) {
      const wkt = players.filter(p => p.awards.includes("Wicket Milestone"))
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 5);
      setQueryResult(`🎯 Wicket Milestone Achievers:\n` + wkt.map(p =>
        `• ${p.player_name} (${p.tournament}) — Score: ${p.performance_score.toFixed(2)}`).join("\n"));
      return;
    }

    setQueryResult(`🔍 No specific data found for "${queryInput}". Try queries like:\n• "Man of Match"\n• "Best Bowler"\n• "National Selection"\n• "Top Performers"\n• "Wicket Milestones"\n• Or a player's name`);
  }, [queryInput]);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      userPrefs, toggleFavoriteTeam, toggleFavoritePlayer,
      filteredPlayers, searchQuery, setSearchQuery,
      queryInput, setQueryInput, queryResult, runQuery,
      selectedPlayer, setSelectedPlayer,
      engagedArticles, engageArticle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export { teams };