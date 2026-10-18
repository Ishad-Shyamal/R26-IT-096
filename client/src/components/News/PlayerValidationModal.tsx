import React from "react";

interface ValidationModalProps {
  player: any;
  onClose: () => void;
}

export default function PlayerValidationModal({ player, onClose }: ValidationModalProps) {
  // Safe extraction matching your main.py FastAPI payload
  const perfScore = Number(player?.performance_score ?? 0);
  const markerScore = Number(player?.marker_score ?? 0);
  const geoRisk = Number(player?.geopolitical_risk ?? 0);
  
  // Extract real dynamic probability from API payload fields (iplProb / nationalProb / IPL_select_probability)
  const rawProb = player?.iplProb ?? player?.nationalProb ?? player?.IPL_select_probability ?? player?.probability ?? 0.5;
  const probability = Number(rawProb);
  
  // Prediction threshold evaluation (0.5 threshold for Random Forest model)
  const predictedSelected = probability >= 0.5;
  
  // Actual selection status from database
  const actualSelected = player?.was_selected === 1 || player?.was_selected === true;

  // Validation Confusion Matrix Verdict Calculation
  let validationVerdict = { label: "", color: "", bg: "", desc: "" };
  if (actualSelected && predictedSelected) {
    validationVerdict = { 
      label: "True Positive (TP) - Validated Selection", 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10 border-emerald-500/30",
      desc: "Model correctly predicted selection based on strong performance metrics and positive news sentiment."
    };
  } else if (!actualSelected && !predictedSelected) {
    validationVerdict = { 
      label: "True Negative (TN) - Validated Exclusion", 
      color: "text-blue-400", 
      bg: "bg-blue-500/10 border-blue-500/30",
      desc: "Model correctly predicted non-selection based on lower impact metrics."
    };
  } else if (!actualSelected && predictedSelected) {
    validationVerdict = { 
      label: "False Positive (FP) - Overestimated", 
      color: "text-amber-400", 
      bg: "bg-amber-500/10 border-amber-500/30",
      desc: "Model predicted selection, but player was not selected in actual squad list."
    };
  } else {
    validationVerdict = { 
      label: "False Negative (FN) - Underestimated", 
      color: "text-rose-400", 
      bg: "bg-rose-500/10 border-rose-500/30",
      desc: "Player was selected despite lower model score (tactical requirement/squad balance)."
    };
  }

  // Dynamic Array Fallbacks for NLP Extracted Markers
  const awards: string[] = player?.awards || player?.nlp_markers || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {player?.player_name || player?.Player || "Unknown Player"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {player?.role || "Player"} • {player?.country || player?.team || "National Pool"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            ✕
          </button>
        </div>

        {/* 1. Model Output Validation Result */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            1. Output Validation Result (Confusion Matrix)
          </span>
          <div className={`p-3.5 rounded-xl border ${validationVerdict.bg} space-y-1.5`}>
            <div className="flex justify-between items-center">
              <span className={`font-bold text-sm ${validationVerdict.color}`}>
                {validationVerdict.label}
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-medium">
                Actual: {actualSelected ? "Selected" : "Not Selected"}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {validationVerdict.desc}
            </p>
          </div>
        </div>

        {/* 2. Feature Contributions & Dynamic Model Confidence */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              2. Feature Contributions (3 Evidence Sources)
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Confidence: {(probability * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px] mb-1">Performance</span>
              <span className="text-orange-400 font-extrabold text-sm">{perfScore.toFixed(1)}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px] mb-1">News Marker</span>
              <span className="text-cyan-400 font-extrabold text-sm">{markerScore.toFixed(1)}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px] mb-1">Geo Risk</span>
              <span className="text-purple-400 font-extrabold text-sm">{geoRisk.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 3. Extracted NLP Markers */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            3. Extracted NLP Markers (spaCy Pipeline)
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {awards.length > 0 ? (
              awards.map((award, i) => (
                <span key={i} className="text-xs bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                  📌 {award}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No specific milestone markers extracted</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all border border-slate-700"
        >
          Close Explanation
        </button>

      </div>
    </div>
  );
}