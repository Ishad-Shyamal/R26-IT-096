from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel
import os
import random

app = FastAPI(title="Match Preview & Review ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD DATA AND MODELS ---
DATA_PATH = "data/processed/"
MODEL_PATH = "models/"

def load_clean(path):
    """Load CSV and immediately reset index and remove duplicate columns."""
    df = pd.read_csv(path)
    df = df.reset_index(drop=True)
    df = df.loc[:, ~df.columns.duplicated()] 
    return df

# Load Master Data
t20_master    = load_clean(f"{DATA_PATH}t20_master.csv")
odi_master    = load_clean(f"{DATA_PATH}odi_master.csv")
test_master   = load_clean(f"{DATA_PATH}test_master.csv")
review_master = load_clean(f"{DATA_PATH}review_master.csv")

# Load Venue Dataframes
try:
    venues_df = load_clean(f"{DATA_PATH}venues_df.csv")
    allgrounds_df = load_clean(f"{DATA_PATH}allgrounds_df.csv")
except Exception as e:
    print(f"Error loading venue files: {e}")
    venues_df = pd.DataFrame()
    allgrounds_df = pd.DataFrame()

# Load Models
clf_t20  = joblib.load(f"{MODEL_PATH}clf_t20.pkl")
clf_odi  = joblib.load(f"{MODEL_PATH}clf_odi.pkl")
clf_test = joblib.load(f"{MODEL_PATH}clf_test.pkl")

FEATURES = [
    "runs", "bat_avg", "strike_rate", "wickets", "bowl_avg", "economy",
    "batting_score", "bowling_score", "allrounder_score", "role_encoded",
    "is_wicketkeeper", "is_batter", "is_bowler", "is_allrounder",
    "high_striker", "economy_bowler", "experienced_batter",
    "wicket_taker", "power_hitter", "elite_striker",
    "elite_batter", "century_scorer", "bat_power", "bowl_impact", "consistency"
]

class MatchRequest(BaseModel):
    team1: str
    team2: str
    venue: str
    format: str

class ReviewRequest(BaseModel):
    team1: str
    team2: str
    match_date: str
    format: str

# --- HELPER FUNCTIONS ---
def get_probable_11_internal(team_name, master_df, clf_model, format_type):
    mask = master_df["team"].str.contains(team_name.strip(), case=False, na=False)
    team_df = master_df[mask].copy().reset_index(drop=True)

    if team_df.empty:
        return []

    team_df = team_df.rename(columns={"Runs 2025": "runs", "Wkts 2025": "wickets"})
    team_df = team_df.loc[:, ~team_df.columns.duplicated()]

    try:
        r, w, sr, ba, ec = team_df["runs"].astype(float), team_df["wickets"].astype(float), team_df["strike_rate"].astype(float), team_df["bat_avg"].astype(float), team_df["economy"].astype(float)
        team_df["bat_power"] = ba * sr
        team_df["bowl_impact"] = w / (ec + 1)
        team_df["consistency"] = r / (sr + 1)
    except:
        return []

    X = team_df[FEATURES].fillna(0)
    team_df["probability"] = clf_model.predict_proba(X)[:, 1]
    top11 = team_df.nlargest(11, "probability").copy().reset_index(drop=True)

    def create_detailed_reason(row):
        name = row["player_name"]
        role = row["role"]
        p_val = row["probability"] * 100
        
        templates = {
            "Wicketkeeper": [
                f"{name} is elite behind the stumps and crucial for DRS calls. His lower-order batting stability makes him a {p_val:.1f}% lock for this match.",
                f"With a sharp eye for stumping, {name} remains the premier choice for the gloves. His current form suggests he will be vital for building partnerships.",
                f"{name} provides reliable keeping skills and a calm head under pressure. His {p_val:.1f}% selection is justified by his high dismissal rate this season."
            ],
            "Batter": [
                f"{name} has shown immense discipline in his shot selection recently. He serves as a technical anchor for the top order, making his selection a {p_val:.1f}% certainty.",
                f"Known for his ability to find gaps, {name} is expected to lead the scoring charge. He excels at converting starts into significant innings for the team.",
                f"{name} is in peak physical condition and dominates the powerplay overs. His presence at the crease consistently puts the opposition on the back foot."
            ],
            "All-Rounder": [
                f"As a versatile {role}, {name} provides the captain with tactical depth in both departments. His {p_val:.1f}% probability reflects his match-winning utility.",
                f"{name} balances the side perfectly by offering an extra bowling option without losing batting strength. He is a proven finisher with both ball and bat.",
                f"The inclusion of {name} allows the team to be more aggressive in the middle overs. He is a high-impact player capable of breaking stubborn partnerships."
            ],
            "Bowler": [
                f"{name} is the primary strike weapon, generating significant movement off the deck. His {p_val:.1f}% rating highlights his role in taking early breakthroughs.",
                f"Mastering the art of death bowling, {name} is expected to be lethal in the final sessions. He maintains a relentless line and length to create pressure.",
                f"{name} provides vital variety to the attack with his clever changes in pace. He is currently one of the most economical options in the squad."
            ]
        }

        if "Wicketkeeper" in role: cat = "Wicketkeeper"
        elif "All-Rounder" in role: cat = "All-Rounder"
        elif "Bowler" in role: cat = "Bowler"
        else: cat = "Batter"
        
        return random.choice(templates[cat])

    top11["reason"] = top11.apply(create_detailed_reason, axis=1)
    
    # --- FIXED LINEUP ORDER LOGIC ---
    # Assigning numerical priorities to force the correct grouping
    role_priority = {
        "Wicketkeeper": 1, 
        "Batter": 2, 
        "Batting All-Rounder": 3, 
        "All-Rounder": 4, 
        "Bowling All-Rounder": 5, 
        "Bowler": 6
    }
    
    top11["priority"] = top11["role"].map(role_priority).fillna(7)
    
    # Sort by Priority group first, then by ML probability within that group
    top11 = top11.sort_values(by=["priority", "probability"], ascending=[True, False]).reset_index(drop=True)

    return top11[["player_name", "role", "probability", "reason", "team"]].to_dict("records")

def analyze_team(xi):
    if not xi: return {"key_batter": "N/A", "bowling_threat": "N/A", "strengths": []}
    return {
        "key_batter": next((p["player_name"] for p in xi if "Batter" in p["role"]), xi[0]["player_name"]),
        "bowling_threat": next((p["player_name"] for p in xi if "Bowler" in p["role"]), "N/A"),
        "strengths": ["Balanced lineup", f"{sum('All-Rounder' in p['role'] for p in xi)} All-rounders"],
    }

# --- ENDPOINTS ---

@app.post("/predict/probable11")
def predict_probable11(req: MatchRequest):
    fmt = req.format.lower()
    m_df = odi_master if fmt == "odi" else (t20_master if fmt == "t20" else test_master)
    model = clf_odi if fmt == "odi" else (clf_t20 if fmt == "t20" else clf_test)

    t1_xi = get_probable_11_internal(req.team1, m_df, model, fmt)
    t2_xi = get_probable_11_internal(req.team2, m_df, model, fmt)

    # --- ENHANCED FUZZY VENUE MATCHING ---
    venue_details = {"pitch_type": "N/A", "assistance": "N/A", "scoring_nature": "N/A", "city": "N/A"}
    search_query = req.venue.strip().lower()

    if not allgrounds_df.empty:
        g_match = allgrounds_df[allgrounds_df["ground_name"].str.lower().apply(lambda x: search_query in str(x) or str(x) in search_query)]
        if not g_match.empty:
            venue_details["city"] = str(g_match.iloc[0].get("City", "N/A"))

    if not venues_df.empty:
        v_match = venues_df[venues_df["Stadium Name"].str.lower().apply(lambda x: search_query in str(x) or str(x) in search_query)]
        if not v_match.empty:
            v = v_match.iloc[0]
            venue_details.update({
                "pitch_type": str(v.get("Pitch Type", "N/A")),
                "assistance": str(v.get("Pitch Assistance", "N/A")),
                "scoring_nature": str(v.get("Scoring Nature", "N/A")),
                "city": str(v.get("City", venue_details["city"]))
            })

    return {
        "success": True,
        "data": {
            "match_info": {"team1": req.team1.upper(), "team2": req.team2.upper(), "format": req.format.upper(), "venue": req.venue},
            "venue_details": venue_details,
            "team1_probable11": t1_xi,
            "team2_probable11": t2_xi,
            "analysis": {"team1": analyze_team(t1_xi), "team2": analyze_team(t2_xi)},
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/review/generate")
def get_match_review(req: ReviewRequest):
    t1, t2, fmt_upper = req.team1.upper(), req.team2.upper(), req.format.upper()
    mask = (review_master["Format"].str.upper() == fmt_upper) & (review_master["Date"].astype(str).str.contains(req.match_date))
    matches = review_master[mask]
    if matches.empty: return {"error": "Match not found."}
    m = matches.iloc[-1]
    return {"match_title": f"{m['Series']}", "final_result": str(m["Result"])}