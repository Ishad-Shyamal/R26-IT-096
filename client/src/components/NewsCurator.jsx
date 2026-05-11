import  { useState } from "react";

import Navbar from "./News/Navbar";
import NewsFeed from "./News/NewsFeed";
import IPLPrediction from "./News/IPLPrediction";
import PerformanceIntelligence from "./News/PerformanceIntelligence";
import QueryEngine from "./News/QueryEngine";

// IMPORTANT
import { AppProvider } from "./context/AppContext";

export default function NewsCurator() {

  // user preferences state
  const [userPreferences, setUserPreferences] = useState({
    teams: [],
    players: [],
  });

  return (
    <AppProvider>
      <div className="min-h-screen bg-black text-white p-6 space-y-8">

        {/* Top Navbar */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-4">
          <Navbar />
        </div>

        {/* IPL Prediction Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            IPL Prediction
          </h2>

          <IPLPrediction />
        </div>

        {/* News Feed Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            News Feed
          </h2>

          <NewsFeed
            userPreferences={userPreferences}
            setUserPreferences={setUserPreferences}
          />
        </div>

        {/* Performance Intelligence Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Performance Intelligence
          </h2>

          <PerformanceIntelligence />
        </div>

        {/* Query Engine Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Query Engine
          </h2>

          <QueryEngine />
        </div>

      </div>
    </AppProvider>
  );
}