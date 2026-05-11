import React, { createContext, useContext, useState, useCallback } from "react";
import { players, Player, teams } from "../data/playersData";

export type Tab = "feed" | "intelligence" | "prediction" | "query";

interface UserPrefs {
  favoriteTeams: string[];
  favoritePlayers: string[];
  preferredTournaments: string[];
}

interface AppContextType {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  userPrefs: UserPrefs;
  toggleFavoriteTeam: (team: string) => void;
  toggleFavoritePlayer: (name: string) => void;
  toggleTournament: (t: string) => void;
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
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [userPrefs, setUserPrefs] = useState<UserPrefs>({
    favoriteTeams: ["Mumbai Indians", "Chennai Super Kings"],
    favoritePlayers: [],
    preferredTournaments: ["Ranji Trophy", "Lanka Premier League", "Pakistan Super League"],
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

  const toggleTournament = useCallback((t: string) => {
    setUserPrefs(prev => ({
      ...prev,
      preferredTournaments: prev.preferredTournaments.includes(t)
        ? prev.preferredTournaments.filter(x => x !== t)
        : [...prev.preferredTournaments, t],
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

    // IPL selection
    if (q.includes("ipl") || q.includes("selection") || q.includes("selected")) {
      const selected = players.filter(p => p.was_selected === 1)
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 8);
      setQueryResult(`✅ Players predicted/selected for IPL (${selected.length} shown):\n` + selected.map(p =>
        `• ${p.player_name} — ${p.tournament} | Score: ${p.performance_score.toFixed(2)}`).join("\n"));
      return;
    }

    // Ranji performers
    if (q.includes("ranji")) {
      const ranji = players.filter(p => p.tournament === "Ranji Trophy")
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 6);
      setQueryResult(`🏏 Top Ranji Trophy Performers:\n` + ranji.map(p =>
        `• ${p.player_name} — Score: ${p.performance_score.toFixed(2)} | IPL Selected: ${p.was_selected ? "Yes" : "No"}`).join("\n"));
      return;
    }

    // LPL/Lanka
    if (q.includes("lpl") || q.includes("lanka")) {
      const lpl = players.filter(p => p.tournament === "Lanka Premier League")
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 6);
      setQueryResult(`🌟 Top Lanka Premier League Performers:\n` + lpl.map(p =>
        `• ${p.player_name} — Score: ${p.performance_score.toFixed(2)} | IPL Selected: ${p.was_selected ? "Yes" : "No"}`).join("\n"));
      return;
    }

    // PSL
    if (q.includes("psl") || q.includes("pakistan")) {
      const psl = players.filter(p => p.tournament === "Pakistan Super League")
        .sort((a, b) => b.performance_score - a.performance_score)
        .slice(0, 6);
      setQueryResult(`⚡ Top PSL Performers:\n` + psl.map(p =>
        `• ${p.player_name} — Score: ${p.performance_score.toFixed(2)} | IPL Selected: ${p.was_selected ? "Yes" : "No"}`).join("\n"));
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
        `IPL Selected: ${matchedPlayer.was_selected ? "✅ Yes" : "❌ No"}\n` +
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

    setQueryResult(`🔍 No specific data found for "${queryInput}". Try queries like:\n• "Man of Match"\n• "Best Bowler"\n• "IPL Selection"\n• "Top Performers"\n• "Ranji Trophy"\n• "LPL"\n• "PSL"\n• Or a player's name`);
  }, [queryInput]);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      userPrefs, toggleFavoriteTeam, toggleFavoritePlayer, toggleTournament,
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
