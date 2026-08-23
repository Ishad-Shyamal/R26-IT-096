from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import random
import os
import joblib
import numpy as np
import pandas as pd

# Try to import SHAP (XAI Library)
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False

load_dotenv()

app = FastAPI(title="InsightCric Explainable AI (XAI) Backend", version="3.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- X-Factor Players Module (additive – no changes to existing logic) ---
from xfactor import router as xfactor_router
app.include_router(xfactor_router)

# =========================
# Configuration
# =========================
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["WinPredictor"]

MODEL_PATH = "cricket_predictor_updated.pkl"

# Feature columns expected by your trained model
FEATURE_COLS = [
    'H2H', 'Form_T1', 'Form_T2', 'Form_Diff', 
    'Strength_T1', 'Strength_T2', 'Strength_Diff',
    'HomeAdv_T1', 'HomeAdv_T2', 'HomeAdv_Diff'
]

print(f"[SYSTEM] XAI Engine Online (SHAP Status: {'ENABLED' if SHAP_AVAILABLE else 'DISABLED'})")

class PredictRequest(BaseModel):
    team1: str = "India"
    team2: str = "Australia"
    format: str = "t20"
    venue: str = "neutral"

# =========================
# Helper Functions
# =========================
def get_team_data(name):
    return db.teams.find_one({"name": name}, {"_id": 0})

def get_h2h_data(t1, t2):
    record = db.head_to_head.find_one({"team1": t1, "team2": t2}, {"_id": 0})
    if record: return record["team1_win_pct"]
    record = db.head_to_head.find_one({"team1": t2, "team2": t1}, {"_id": 0})
    if record: return 1.0 - record["team1_win_pct"]
    return 0.5

def get_shap_explanation(model, X, winner_idx, team_names):
    """
    Uses SHAP (Shapley Values) to find the #1 reason for the prediction.
    """
    if not SHAP_AVAILABLE:
        return "ML Model (Random Forest) analyzed historical patterns to determine this outcome."
    
    try:
        explainer = shap.TreeExplainer(model)
        # Calculate SHAP values for this specific match
        # [0] for Team 1 win class, [1] for Team 2 win class
        shap_v = explainer.shap_values(X)[winner_idx]
        
        # Find the index of the feature with the highest positive impact
        top_feature_idx = np.argmax(shap_v)
        top_feature_name = FEATURE_COLS[top_feature_idx]
        
        # Human-friendly descriptions for features
        friendly_names = {
            'H2H': "strong head-to-head record",
            'Form_T1': f"{team_names[0]}'s excellent recent form",
            'Form_T2': f"{team_names[1]}'s current performance level",
            'Form_Diff': "the significant gap in recent match form",
            'Strength_T1': f"{team_names[0]}'s power in these conditions",
            'Strength_T2': f"{team_names[1]}'s squad depth",
            'Strength_Diff': "overall team quality difference",
            'HomeAdv_T1': f"the massive home ground advantage of {team_names[0]}",
            'HomeAdv_T2': f"the massive home ground advantage of {team_names[1]}",
            'HomeAdv_Diff': "the venue impact on player performance"
        }
        
        reason = friendly_names.get(top_feature_name, "historical performance metrics")
        return f"AI Insight (SHAP): The model favors {team_names[winner_idx]} primarily due to {reason}."
    except Exception as e:
        print(f"[SHAP ERROR] {e}")
        return "The Ensemble model identified multiple winning patterns based on historical data."

# =========================
# API Endpoints
# =========================

@app.get("/")
def health_check():
    mode = "XAI Enabled" if (os.path.exists(MODEL_PATH) and SHAP_AVAILABLE) else "Standard Mode"
    return {"status": "running", "engine": mode}

@app.get("/model/info")
def get_model_info():
    if not os.path.exists(MODEL_PATH):
        return {"error": "Model file not found."}
    try:
        model = joblib.load(MODEL_PATH)
        info = {
            "model_type": type(model).__name__,
            "trees": getattr(model, 'n_estimators', 'N/A'),
            "feature_importance_pct": {}
        }
        if hasattr(model, 'feature_importances_'):
            for name, imp in zip(FEATURE_COLS, model.feature_importances_):
                info["feature_importance_pct"][name] = round(float(imp) * 100, 2)
        return {"status": "success", "metadata": info}
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
def predict_match(data: PredictRequest):
    t1, t2 = data.team1, data.team2
    venue = data.venue
    
    t1_data = get_team_data(t1)
    t2_data = get_team_data(t2)
    
    if not t1_data or not t2_data:
        raise HTTPException(status_code=400, detail="Data for selected teams not found.")

    # Feature Calculation
    h2h = get_h2h_data(t1, t2)
    f1, f2 = t1_data['form'], t2_data['form']
    s1 = t1_data['home_strength'] if venue == 't1' else t1_data['away_strength']
    s2 = t2_data['home_strength'] if venue == 't2' else t2_data['away_strength']
    ha1 = 1 if venue == 't1' else 0
    ha2 = 1 if venue == 't2' else 0

    X = np.array([[h2h, f1, f2, (f1-f2), s1, s2, (s1-s2), ha1, ha2, (ha1-ha2)]])

    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            probs = model.predict_proba(X)[0]
            pred_idx = model.predict(X)[0] # 0 or 1
            
            winner_name = t1 if pred_idx == 0 else t2
            
            # --- SHAP EXPLAINER ---
            explanation = get_shap_explanation(model, X, pred_idx, [t1, t2])
            
            result = {
                "winner_name": winner_name,
                "winner_code": 1 if pred_idx == 0 else 2,
                "probability_team1": float(probs[0]),
                "probability_team2": float(probs[1]),
                "explanation": explanation,
                "engine": "XAI (SHAP + RandomForest)"
            }
        except Exception as e:
            print(f"[ML FAIL] {e}")
            result = run_fallback(t1, t2, X[0])
    else:
        result = run_fallback(t1, t2, X[0])

    db.predictions.insert_one({**result, "timestamp": datetime.now(timezone.utc)})
    return result

def run_fallback(t1, t2, features):
    p1 = 0.5 + (features[0] - 0.5) + (features[3]/200)
    p1 = max(0.05, min(0.95, p1))
    winner = t1 if p1 > 0.5 else t2
    return {
        "winner_name": winner, "winner_code": 1 if p1 > 0.5 else 2,
        "probability_team1": p1, "probability_team2": 1 - p1,
        "explanation": "Predicted win based on historical ranking and recent team form metrics.",
        "engine": "Algorithmic (Fallback)"
    }

@app.get("/predictions/history")
def get_history(limit: int = 10):
    history = list(db.predictions.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
    return {"status": "success", "data": history}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
