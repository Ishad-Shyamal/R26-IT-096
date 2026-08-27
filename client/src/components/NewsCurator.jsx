import { useState } from "react";
import NewsNavbar from "./News/Navbar";
import NewsFeed from "./News/NewsFeed";
import IPLPrediction from "./News/IPLPrediction";
import QueryEngine from "./News/QueryEngine";
import { AppProvider, useApp } from "./context/AppContext";

function MainContent() {
  const { activeTab } = useApp();

  const [userPreferences, setUserPreferences] = useState({
    teams: [],
    players: [],
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8" style={{ paddingTop: '90px' }}>
      
      {/* News Curator Sub-Navbar */}
      <NewsNavbar />

      {/* National Team Select Prediction Tab */}
      {activeTab === "prediction" && (
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            National Team Select Prediction
          </h2>
          <IPLPrediction />
        </div>
      )}

      {/* News Feed Tab */}
      {activeTab === "feed" && (
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Players Profile & News Feed
          </h2>
          <NewsFeed
            userPreferences={userPreferences}
            setUserPreferences={setUserPreferences}
          />
        </div>
      )}

      {/* Query Engine Tab */}
      {activeTab === "query" && (
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Query Engine
          </h2>
          <QueryEngine />
        </div>
      )}

    </div>
  );
}

export default function NewsCurator() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}