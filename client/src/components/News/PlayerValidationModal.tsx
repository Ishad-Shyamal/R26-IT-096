import React from "react";

interface ValidationModalProps {
  player: any;
  onClose: () => void;
}

export default function PlayerValidationModal({ player, onClose }: ValidationModalProps) {
  // Safe extraction of fields from dynamic API payload
  const perfScore = Number(player?.performance_score ?? player?.performance_metric ?? 0);
  const markerScore = Number(player?.marker_score ?? player?.markerScore ?? 0);
  
  // Array Fallbacks to prevent TypeError: Cannot read properties of undefined (reading 'length')
  const awards: string[] = player?.awards || player?.nlp_markers || [];
  
  const predictedSelected = perfScore >= 50; // ML Threshold Example
  const actualSelected = player?.was_selected === 1 || player?.was_selected === true;

  // Validation Confusion Matrix Verdict
  let validationVerdict = { label: "", color: "", bg: "", desc: "" };
  if (actualSelected && predictedSelected) {
    validationVerdict = { 
      label: "True Positive (TP) - Valid", 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/20 border-emerald-500/40",
      desc: "Model correctly predicted selection based on strong news markers."
    };
  } else if (!actualSelected && !predictedSelected) {
    validationVerdict = { 
      label: "True Negative (TN) - Valid", 
      color: "text-blue-400", 
      bg: "bg-blue-500/20 border-blue-500/40",
      desc: "Model correctly predicted non-selection based on low impact news attributes."
    };
  } else if (!actualSelected && predictedSelected) {
    validationVerdict = { 
      label: "False Positive (FP) - Overestimated", 
      color: "text-amber-400", 
      bg: "bg-amber-500/20 border-amber-500/40",
      desc: "Model predicted selection, but player was not selected."
    };
  } else {
    validationVerdict = { 
      label: "False Negative (FN) - Underestimated", 
      color: "text-rose-400", 
      bg: "bg-rose-500/20 border-rose-500/40",
      desc: "Player was selected despite lower model performance score."
    };
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white">{player?.player_name || "Unknown Player"}</h3>
            <p className="text-xs text-slate-400">{player?.role || "Player"} • {player?.team || "Domestic"}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 bg-slate-800 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* 1. Model Validation Status */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            1. Output Validation Result
          </span>
          <div className={`p-3 rounded-xl border ${validationVerdict.bg} space-y-1`}>
            <div className="flex justify-between items-center">
              <span className={`font-bold text-sm ${validationVerdict.color}`}>
                {validationVerdict.label}
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                Actual: {actualSelected ? "Selected" : "Not Selected"}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {validationVerdict.desc}
            </p>
          </div>
        </div>

        {/* 2. Influencing News Attributes */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            2. Influencing News Attributes (Features)
          </span>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block">Performance Metric</span>
              <span className="text-orange-400 font-bold text-base">{perfScore.toFixed(2)}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block">Marker Score (NLP)</span>
              <span className="text-cyan-400 font-bold text-base">{markerScore.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 3. Extracted Awards & Keywords */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            3. Extracted NLP Markers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {awards.length > 0 ? (
              awards.map((award, i) => (
                <span key={i} className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-2.5 py-1 rounded-lg">
                  🏆 {award}
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
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all"
        >
          Close Explanation
        </button>

      </div>
    </div>
  );
}