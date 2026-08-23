from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
import json
import joblib
import numpy as np
 
# =========================================================
# FASTAPI APP
# =========================================================
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# =========================================================
# PATHS
# =========================================================
DATA_PATH  = "data/processed/"
MODEL_PATH = "models/"
 
# =========================================================
# REQUEST MODELS
# =========================================================
class MatchRequest(BaseModel):
    team1: str
    team2: str
    venue: str
    format: str
 
class ReviewRequest(BaseModel):
    team1: str
    team2: str
    format: str
    match_date: str
 
# =========================================================
# LOAD CSV
# =========================================================
def load_csv(filename):
    path = os.path.join(DATA_PATH, filename)
    if not os.path.exists(path):
        print(f"  [MISSING] {filename}")
        return pd.DataFrame()
    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()
    df = df.loc[:, ~df.columns.duplicated(keep="first")]
    return df.reset_index(drop=True)
 
def load_json(filename):
    path = os.path.join(DATA_PATH, filename)
    if not os.path.exists(path):
        print(f"  [MISSING] {filename}")
        return {}
    with open(path, "r") as f:
        return json.load(f)
 
# =========================================================
# LOAD DATA
# =========================================================
t20_master   = load_csv("t20_master.csv")
odi_master   = load_csv("odi_master.csv")
test_master  = load_csv("test_master.csv")
venues_df    = load_csv("venues_df.csv")
allgrounds_df= load_csv("allgrounds_df.csv")
review_master= load_csv("review_master.csv")
 
t20_rpo_df        = load_csv("t20_rpo_df.csv")
t20_rpw_df        = load_csv("t20_rpw_df.csv")
odi_rpo_df        = load_csv("odi_rpo_df.csv")
odi_rpw_df        = load_csv("odi_rpw_df.csv")
test_rpo_df       = load_csv("test_rpo_df.csv")
test_rpw_df       = load_csv("test_rpw_df.csv")
odi_home_away_df  = load_csv("odi_home_away_df.csv")
test_home_away_df = load_csv("test_home_away_df.csv")
 
lineups_t20  = load_json("lineups_t20.json")
lineups_odi  = load_json("lineups_odi.json")
lineups_test = load_json("lineups_test.json")
 
# =========================================================
# LOAD MODELS
# =========================================================
try:
    clf_t20  = joblib.load(f"{MODEL_PATH}clf_t20.pkl")
    clf_odi  = joblib.load(f"{MODEL_PATH}clf_odi.pkl")
    clf_test = joblib.load(f"{MODEL_PATH}clf_test.pkl")
    print("Models loaded successfully.")
except Exception as e:
    print(f"Model Load Error: {e}")
    clf_t20 = clf_odi = clf_test = None
 
# =========================================================
# FEATURE ENGINEERING  (mirrors notebook build_model_features)
# =========================================================
def build_model_features(df, fmt):
    df = df.copy()
 
    # Ensure all source columns are numeric
    for col in ["bat_avg","strike_rate","runs","wickets","bowl_avg",
                "economy","batting_score","bowling_score","allrounder_score",
                "role_encoded","is_spin_bowler","is_pace_bowler",
                "power_hitter","high_striker","wicket_taker","economy_bowler",
                "experienced_batter","is_allrounder","is_bowler"]:
        if col not in df.columns:
            df[col] = 0
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
 
    df["bat_power"]               = df["bat_avg"] * df["strike_rate"]
    df["bowl_impact"]             = df["wickets"] * (7 - df["economy"])
    df["consistency"]             = (df["runs"] + 1) / (df["strike_rate"] + 1)
    df["experience_index"]        = (df["runs"] * 0.4) + (df["wickets"] * 30)
    df["impact_score"]            = (df["batting_score"]    * 0.5 +
                                      df["bowling_score"]    * 0.3 +
                                      df["allrounder_score"] * 0.2)
    df["overall_rating"]          = df["bat_power"] + df["bowl_impact"] + df["impact_score"]
    df["avg_sr_ratio"]            = df["bat_avg"] / (df["strike_rate"] + 1)
    df["wicket_economy_ratio"]    = (df["wickets"] + 1) / (df["economy"] + 1)
    df["role_impact"]             = df["role_encoded"] * df["impact_score"]
    df["batting_bowling_balance"] = (df["batting_score"] - df["bowling_score"]).abs()
    df["spin_quality"]            = df["is_spin_bowler"] * df["bowling_score"]
    df["pace_quality"]            = df["is_pace_bowler"] * df["bowling_score"]
 
    if fmt == "T20":
        df["t20_sr_premium"]       = np.where(df["strike_rate"] > 130,
                                              (df["strike_rate"]-130)*df["bat_avg"], 0)
        df["t20_economy_bonus"]    = np.where(df["economy"] < 7.5,
                                              (7.5-df["economy"])*df["wickets"], 0)
        df["t20_power_flag"]       = df["power_hitter"] * df["high_striker"]
        df["t20_death_bowler"]     = df["wicket_taker"] * df["economy_bowler"]
        df["t20_allrounder_value"] = df["is_allrounder"] * (df["batting_score"]+df["bowling_score"])
        df["t20_boundary_proxy"]   = df["strike_rate"] * df["power_hitter"]
        df["t20_finisher_value"]   = df["high_striker"] * df["bat_avg"] * df["is_allrounder"]
        df["t20_spin_value"]       = df["spin_quality"] * df["economy_bowler"]
        df["t20_pace_value"]       = df["pace_quality"] * df["wicket_taker"]
 
    elif fmt == "ODI":
        df["odi_anchor_value"]     = df["bat_avg"] * df["consistency"]
        df["odi_death_bowler"]     = df["wicket_taker"] * df["economy_bowler"]
        df["odi_avg_premium"]      = np.where(df["bat_avg"] > 35,
                                              (df["bat_avg"]-35)*df["consistency"], 0)
        df["odi_sr_bonus"]         = np.where(df["strike_rate"] > 85,
                                              (df["strike_rate"]-85)*df["bat_avg"], 0)
        df["odi_economy_bonus"]    = np.where(df["economy"] < 5.5,
                                              (5.5-df["economy"])*df["wickets"], 0)
        df["odi_experienced_bat"]  = df["experienced_batter"] * df["bat_avg"]
        df["odi_allrounder_val"]   = df["is_allrounder"] * (df["batting_score"]*0.6 +
                                                             df["bowling_score"]*0.4)
        df["odi_spin_value"]       = df["spin_quality"] * df["economy_bowler"]
        df["odi_pace_value"]       = df["pace_quality"] * df["wicket_taker"]
 
    elif fmt == "Test":
        df["test_avg_premium"]     = np.where(df["bat_avg"] > 40,
                                              (df["bat_avg"]-40)*df["consistency"], 0)
        df["test_wicket_value"]    = df["wickets"] * df["bowl_avg"].apply(
                                         lambda x: max(0, 35-x))
        df["test_elite_bat"]       = np.where(df["bat_avg"] > 45,
                                              (df["bat_avg"]-45)*df["runs"], 0)
        df["test_bowl_quality"]    = np.where(df["bowl_avg"] < 30,
                                              (30-df["bowl_avg"])*df["wickets"], 0)
        df["test_run_accumulator"] = df["experienced_batter"] * df["runs"]
        df["test_allrounder_val"]  = df["is_allrounder"] * (df["batting_score"]*0.5 +
                                                             df["bowling_score"]*0.5)
        df["test_wicket_taker"]    = df["wicket_taker"] * df["wickets"]
        df["test_spin_value"]      = df["spin_quality"] * (
                                         1 / (df["bowl_avg"].replace(0,99)+1))
        df["test_pace_value"]      = df["pace_quality"] * (
                                         1 / (df["bowl_avg"].replace(0,99)+1))
    return df
 
# =========================================================
# VENUE PROFILE
# =========================================================
def get_venue_profile(venue_name, fmt):
    profile = {
        "country":"Unknown", "stadium":venue_name, "city":"Unknown",
        "pitch_type":"Balanced", "pitch_assist":"Unknown",
        "scoring":"Medium", "rpo":0.0, "rpw":0.0, "matches_played":0,
    }
    search = venue_name.lower().strip()
    fmt_map = {"ODI":"ODI","T20":"T20","TEST":"Test"}
    target_fmt_col = fmt_map.get(fmt.upper(), "ODI")

    # Helper to check if any common string names cross over
    def names_match(val1, val2):
        s1 = str(val1).lower().strip().replace(".", "").replace(",", "")
        s2 = str(val2).lower().strip().replace(".", "").replace(",", "")
        if not s1 or not s2 or s1 == "nan" or s2 == "nan":
            return False
        # Remove common suffixes for cleaner matching
        for suffix in [" stadium", " cricket ground", " oval", " park", " ground"]:
            s1 = s1.replace(suffix, "")
            s2 = s2.replace(suffix, "")
        s1 = s1.strip(); s2 = s2.strip()
        if s1 in s2 or s2 in s1:
            return True
        if "mcg" in s1 and "melbourne cricket" in s2: return True
        if "mcg" in s2 and "melbourne cricket" in s1: return True
        if "scg" in s1 and "sydney cricket" in s2: return True
        if "scg" in s2 and "sydney cricket" in s1: return True
        return False

    def find_row(df, resolved_city=None):
        if df is None or df.empty:
            return None
        
        cols = [c for c in df.columns
                if c.lower() in ["ground_name","ground","city","stadium","stadium name","stadium_name"]]
        if not cols:
            return None
        
        # Step A: Try checking stadium/ground name crossovers
        for idx, row in df.iterrows():
            for c in cols:
                if c in df.columns and pd.notna(row[c]):
                    if names_match(search, row[c]):
                        return row

        # Step B: Strict fallback by city alignment if we know the city (fixes completely different names)
        if resolved_city and resolved_city != "Unknown":
            city_search = resolved_city.lower().strip()
            for idx, row in df.iterrows():
                # Check columns that look like a city column
                city_cols = [c for c in df.columns if "city" in c.lower()]
                for cc in city_cols:
                    if pd.notna(row[cc]) and str(row[cc]).lower().strip() == city_search:
                        return row
        return None

    # 1. Look up Master ground configuration first to capture accurate metadata
    ag = find_row(allgrounds_df)
    resolved_city = "Unknown"
    if ag is not None:
        profile["stadium"] = str(ag.get("Ground", ag.get("ground_name", venue_name)))
        profile["city"]    = str(ag.get("City",    "Unknown"))
        profile["country"] = str(ag.get("Country", "Unknown"))
        resolved_city      = profile["city"]
        if target_fmt_col in ag:
            try: profile["matches_played"] = int(ag[target_fmt_col])
            except: pass

    # 2. Extract profile surface characteristics
    v = find_row(venues_df, resolved_city=resolved_city)
    if v is not None:
        if resolved_city == "Unknown" and "city" in v:
            profile["city"] = str(v["city"])
            resolved_city = profile["city"]
        if profile["country"] == "Unknown" and "country" in v:
            profile["country"] = str(v["country"])

        for key, cands in [
            ("pitch_type",   ["pitch_type",   "Pitch Type"]),
            ("pitch_assist", ["pitch_assist", "Pitch Assistance", "Pitch Assist"]),
            ("scoring",      ["scoring",      "Scoring Nature", "Scoring"]),
        ]:
            for c in cands:
                if c in v.index and str(v[c]) not in ["nan","None",""]:
                    profile[key] = str(v[c])
                    break

    # 3. Extract metrics using the name matcher AND City fallback
    rpo_map  = {"T20":t20_rpo_df,  "ODI":odi_rpo_df,  "TEST":test_rpo_df}
    rpw_map  = {"T20":t20_rpw_df,  "ODI":odi_rpw_df,  "TEST":test_rpw_df}
    
    for df_g, key in [(rpo_map.get(fmt.upper()), "rpo"),
                      (rpw_map.get(fmt.upper()), "rpw")]:
        row = find_row(df_g, resolved_city=resolved_city)
        if row is not None:
            col = key if key in row.index else row.index[-1]
            try: profile[key] = float(row[col])
            except: pass

    return profile
 
# =========================================================
# CONDITION CLASSIFIER
# =========================================================
# =========================================================
# CONDITION CLASSIFIER
# =========================================================
def classify_conditions(venue, fmt):
    scoring      = str(venue.get("scoring",      "medium")).lower()
    pitch_assist = str(venue.get("pitch_assist", "unknown")).lower()
    rpo          = venue.get("rpo", 0.0)

    # ── RPO-based scoring bands per format ───────────────
    fmt_up = fmt.upper()
    if fmt_up == "TEST":
        # Test: >3.3 high | <2.8 low | 2.8–3.3 balanced
        rpo_high = rpo > 3.0
        rpo_low  = 0 < rpo < 2.9
        rpo_balanced = 2.9 <= rpo <= 3.0
    elif fmt_up == "ODI":
        # ODI: >5.1 high | <4.1 low | 4.1–5.1 balanced
        rpo_high = rpo > 5.1
        rpo_low  = 0 < rpo < 4.1
        rpo_balanced = 4.1 <= rpo <= 5.1
    else:  # T20
        # T20: >8.9 high | <8.0 low | 8.0–8.9 balanced
        rpo_high = rpo > 8.9
        rpo_low  = 0 < rpo < 8.0
        rpo_balanced = 8.0 <= rpo <= 8.9

    # ── Venue label reading ───────────────────────────────
    label_high    = "high" in scoring or "ultra" in scoring
    label_low     = "low"  in scoring and "high" not in scoring
    label_neutral = not label_high and not label_low

    # ── Priority logic ────────────────────────────────────
    # If RPO is available (> 0), RPO band takes full priority
    # If RPO is 0 (missing/unmatched), fall back to venue label
    if rpo > 0:
        is_high = rpo_high
        is_low  = rpo_low
        # rpo_balanced → both False → balanced
    else:
        # RPO missing: trust venue label only
        is_high = label_high
        is_low  = label_low

    # ── Pitch assist keywords ─────────────────────────────
    spin_kw = ["spin","turn","dust","rough","dry","slow"]
    pace_kw = ["pace","seam","swing","bounce","fast","green","extreme"]
    is_spin = any(k in pitch_assist for k in spin_kw)
    is_pace = any(k in pitch_assist for k in pace_kw)

    return is_high, is_low, is_spin, is_pace
 
# =========================================================
# BOWLER PITCH BOOST
# =========================================================
def bowler_pitch_boost(role, pitch_assist):
    pa      = str(pitch_assist).lower()
    spin_kw = ["spin","turn","dust","rough","dry"]
    pace_kw = ["pace","seam","swing","bounce","fast","green","extreme"]
    is_spin = any(k in pa for k in spin_kw)
    is_pace = any(k in pa for k in pace_kw)
    if role == "Spin Bowler":
        if is_spin: return 1.30
        if is_pace: return 0.75
    if role == "Pace Bowler":
        if is_pace: return 1.30
        if is_spin: return 0.75
    if role in ["Bowler","Bowling All-Rounder"]:
        if is_spin or is_pace: return 1.10
    return 1.0
 
# =========================================================
# OPPONENT PROFILE
# =========================================================
def get_opponent_profile(opponent_name, master_df, fmt):
    profile = {
        "opp_spin_vulnerable" : False,
        "opp_pace_vulnerable" : False,
        "opp_batting_strength": "average",
        "opp_avg_bat_avg"     : 25.0,
    }
    opp_df = master_df[master_df["team"] == opponent_name].copy()
    if opp_df.empty:
        return profile
 
    batting_roles = ["Batter","Wicketkeeper","Batting All-Rounder","All-Rounder"]
    top_batters   = opp_df[opp_df["role"].isin(batting_roles)].nlargest(6,"bat_avg")
    if top_batters.empty:
        return profile
 
    avg_bat_avg = top_batters["bat_avg"].mean()
    profile["opp_avg_bat_avg"] = float(round(avg_bat_avg, 2))
    strong_thr = {"T20":28,"ODI":35,"TEST":42}.get(fmt,32)
    weak_thr   = {"T20":18,"ODI":25,"TEST":30}.get(fmt,22)
 
    if avg_bat_avg >= strong_thr:
        profile["opp_batting_strength"] = "strong"
    elif avg_bat_avg <= weak_thr:
        profile["opp_batting_strength"] = "weak"
        
        low_sr = (top_batters["strike_rate"] < 110).sum() if fmt=="T20" \
            else (top_batters["strike_rate"] < 65).sum()
        profile["opp_spin_vulnerable"] = bool(low_sr >= 3)
        
        low_avg_high_sr = (
                (top_batters["bat_avg"] < weak_thr) &
                (top_batters["strike_rate"] > 120 if fmt=="T20"
                else top_batters["strike_rate"] > 75)
            ).sum()
        profile["opp_pace_vulnerable"] = bool(low_avg_high_sr >= 2)

    return profile
 
# =========================================================
# LINEUP ANCHORS
# =========================================================
def get_lineup_anchors(team_name, opponent_name, lineup_dict,
                       team_df, min_anchor=7):
    if not lineup_dict or team_name not in lineup_dict:
        return []
    opp_lineups = lineup_dict[team_name]
    matched_key = next(
        (k for k in opp_lineups
         if opponent_name.lower() in k.lower() or
            k.lower() in opponent_name.lower()), None)
    if not matched_key:
        return []
    last_xi = [str(p).lower().strip()
               for p in opp_lineups[matched_key] if str(p).strip()]
    if "player_name" not in team_df.columns:
        return []
    anchor_indices = []
    for idx, row in team_df.iterrows():
        p = str(row["player_name"]).lower().strip()
        if any(p in ln or ln in p for ln in last_xi):
            anchor_indices.append(idx)
        if len(anchor_indices) >= min_anchor:
            break
    return anchor_indices
 
# =========================================================
# BATTING ORDER MAP
# =========================================================
def build_batting_order_map(team_name, opponent_name, lineup_dict):
    order_map = {}
    if not lineup_dict or team_name not in lineup_dict:
        return order_map
    opp_lineups = lineup_dict[team_name]
    matched_key = next(
        (k for k in opp_lineups
         if opponent_name.lower() in k.lower() or
            k.lower() in opponent_name.lower()), None)
    if matched_key:
        for pos, p_name in enumerate(opp_lineups[matched_key], 1):
            order_map[str(p_name).lower().strip()] = pos
    return order_map
 
def get_batting_position(player_name, order_map):
    p = str(player_name).lower().strip()
    if p in order_map:
        return order_map[p]
    for ln, pos in order_map.items():
        p_first  = p.split()[0]  if p  else ""
        ln_first = ln.split()[0] if ln else ""
        if p_first == ln_first and (p in ln or ln in p):
            return pos
    return 99
 
# =========================================================
# CORE PREDICTION
# =========================================================
def get_probable_11_internal(
    team_name, opponent_name, master_df,
    clf_model, fmt, venue, lineup_dict
):
    if master_df.empty or clf_model is None:
        return {"players":[], "key_player":"N/A",
                "key_role":"N/A", "strength":"N/A"}
 
    # ── Deduplicate: one row per player ──────────────────
    team_df = master_df[
        master_df["team"].str.strip().str.lower() ==
        team_name.strip().lower()
    ].copy()
 
    if team_df.empty:
        return {"players":[], "key_player":"N/A",
                "key_role":"N/A", "strength":"N/A"}
 
    if "player_name" in team_df.columns:
        team_df = (team_df
                   .sort_values("batting_score", ascending=False)
                   .drop_duplicates(subset=["player_name"], keep="first")
                   .reset_index(drop=True))
    else:
        team_df = team_df.drop_duplicates().reset_index(drop=True)
 
    # ── Feature engineering ───────────────────────────────
    team_df = build_model_features(team_df, fmt)
 
    # ── Align to model features ───────────────────────────
    try:
        model_feats = clf_model.get_booster().feature_names
        if model_feats:
            for f in model_feats:
                if f not in team_df.columns:
                    team_df[f] = 0.0
            X = team_df[model_feats].fillna(0)
        else:
            raise ValueError("No feature names in model")
    except Exception:
        X = team_df.select_dtypes(include=[np.number]).fillna(0)
 
    team_df["probability"] = clf_model.predict_proba(X)[:, 1]
 
    # ── Conditions ────────────────────────────────────────
    is_high, is_low, is_spin, is_pace = classify_conditions(venue, fmt)
    pitch_assist = venue.get("pitch_assist", "Unknown")
 
    # ── Opponent profile ──────────────────────────────────
    opp = get_opponent_profile(opponent_name, master_df, fmt)
    opp_spin_v = opp["opp_spin_vulnerable"]
    opp_pace_v = opp["opp_pace_vulnerable"]
    opp_str    = opp["opp_batting_strength"]
 
    # ── Per-player boosts ─────────────────────────────────
    for idx, row in team_df.iterrows():
        boost = bowler_pitch_boost(row["role"], pitch_assist)
        if row["role"] == "Spin Bowler" and opp_spin_v:
            boost *= 1.10
        if row["role"] == "Pace Bowler" and opp_pace_v:
            boost *= 1.10
        team_df.at[idx, "probability"] *= boost
 
    if is_high:
        mask = team_df["role"].isin(["Batter","Batting All-Rounder","Wicketkeeper"])
        team_df.loc[mask, "probability"] *= 1.10
    if opp_str == "weak":
        mask = team_df["role"].isin(["Bowler","Spin Bowler","Pace Bowler",
                                      "Bowling All-Rounder"])
        team_df.loc[mask, "probability"] *= 1.08
 
    team_df["probability"] = team_df["probability"].clip(0, 0.99)
 
    # ── Lineup anchors ────────────────────────────────────
    anchor_indices = get_lineup_anchors(
        team_name, opponent_name, lineup_dict, team_df, min_anchor=7)
    selected = list(anchor_indices)
 
    def pick(roles, count):
        nonlocal selected
        if count <= 0:
            return
        mask  = team_df["role"].isin(roles) & ~team_df.index.isin(selected)
        picks = team_df[mask].nlargest(count, "probability").index.tolist()
        selected.extend(picks)
 
    # ── Bowler quota ──────────────────────────────────────
    if is_spin and not is_pace:
        n_spin, n_pace = 3, 1
    elif is_pace and not is_spin:
        n_spin, n_pace = 1, 3
    else:
        n_spin, n_pace = 2, 2
 
    if opp_spin_v and not (is_pace and not is_spin):
        n_spin = min(n_spin+1, 4); n_pace = max(n_pace-1, 0)
    elif opp_pace_v and not (is_spin and not is_pace):
        n_pace = min(n_pace+1, 4); n_spin = max(n_spin-1, 0)
 
    # Guarantee minimum 3 pure bowlers
    if n_spin + n_pace < 3:
        if n_spin >= n_pace: n_spin = 2; n_pace = 1
        else:                n_spin = 1; n_pace = 2
 
    anchored_roles = team_df.loc[anchor_indices,"role"].tolist() if anchor_indices else []
    def anch(roles): return sum(1 for r in anchored_roles if r in roles)
 
    need_wk   = max(0, 1 - anch(["Wicketkeeper"]))
    need_bat  = max(0, 3 - anch(["Batter"]))
    need_ar   = max(0, 2 - anch(["All-Rounder","Batting All-Rounder","Bowling All-Rounder"]))
    need_spin = max(0, n_spin - anch(["Spin Bowler"]))
    need_pace = max(0, n_pace - anch(["Pace Bowler","Bowler"]))
 
    pick(["Wicketkeeper"], need_wk)
    pick(["Batter"], need_bat)
    pick(["Batting All-Rounder","All-Rounder","Bowling All-Rounder"], need_ar)
    pick(["Spin Bowler"], need_spin)
    pick(["Pace Bowler","Bowler"], need_pace)
 
    # Hard guarantee 3 pure bowlers
    cur_pure = sum(1 for i in selected
                   if team_df.loc[i,"role"] in ["Spin Bowler","Pace Bowler","Bowler"])
    if cur_pure < 3:
        extra = 3 - cur_pure
        if is_spin or n_spin >= n_pace:
            pick(["Spin Bowler","Pace Bowler","Bowler"], extra)
        else:
            pick(["Pace Bowler","Bowler","Spin Bowler"], extra)
 
    # ── 11th dynamic slot ─────────────────────────────────
    if len(selected) < 11:
        if is_high:
            # High scoring venue: favour extra bowler or bowling all-rounder
            pick(["Bowling All-Rounder","Spin Bowler","Pace Bowler","Bowler"], 1)
        elif is_low:
            # Low scoring venue: favour extra batter or batting all-rounder
            pick(["Batter","Batting All-Rounder","Wicketkeeper"], 1)
        elif is_spin or opp_spin_v: pick(["Spin Bowler","Bowling All-Rounder"], 1)
        elif is_pace or opp_pace_v: pick(["Pace Bowler","Bowler"], 1)
        else: pick(["All-Rounder","Batting All-Rounder","Bowling All-Rounder"], 1)
 
    # ── Safety catch ──────────────────────────────────────
    if len(selected) < 11:
        backups = (team_df[~team_df.index.isin(selected)]
                   .nlargest(11-len(selected), "probability").index.tolist())
        selected.extend(backups)
 
    seen_set = set()
    selected = [i for i in selected if not (i in seen_set or seen_set.add(i))]
 
    final_xi = team_df.loc[selected[:11]].copy()
 
    if "player_name" in final_xi.columns:
        final_xi["player"] = final_xi["player_name"]
 
    final_xi["probability"] = (final_xi["probability"] * 100).round(2)
 
    # ── Batting order sort ────────────────────────────────
    order_map = build_batting_order_map(team_name, opponent_name, lineup_dict)
    bowler_set = {"Bowler","Spin Bowler","Pace Bowler","Bowling All-Rounder"}
    role_group = {
        "Wicketkeeper":1,"Batter":1,
        "Batting All-Rounder":2,"All-Rounder":3,
        "Bowling All-Rounder":4,"Spin Bowler":5,"Pace Bowler":5,"Bowler":5,
    }
    final_xi["_rg"] = final_xi["role"].map(role_group).fillna(5)
    final_xi["_bp"] = final_xi["player"].apply(
        lambda p: get_batting_position(p, order_map))
    final_xi["_sk"] = final_xi.apply(
        lambda r: r["_bp"] if (r["_rg"]==1 and r["_bp"]!=99)
                  else (50+(100-r["probability"]) if r["_rg"]==1
                        else (100-r["probability"])),
        axis=1)
    final_xi = final_xi.sort_values(["_rg","_sk"], ascending=[True,True])
    final_xi.drop(columns=["_rg","_bp","_sk"], inplace=True, errors="ignore")
 
    # ── Build player reason text ──────────────────────────
    stadium = venue.get("stadium", "this venue")
    results = []
 
    for _, row in final_xi.iterrows():
        player_name  = row.get("player_name", "Unknown")
        role         = str(row.get("role", "Unknown"))
        p            = float(row.get("probability", 0)) / 100
        prob_pct     = row.get("probability", 0)
        t            = team_name
        is_anchor    = row.name in anchor_indices
 
        total_matches = int(row.get("matches_played", 0))
        centuries     = int(row.get("centuries",    0)) if "centuries"    in row else 0
        five_wickets  = int(row.get("five_wickets", 0)) if "five_wickets" in row else 0
 
        exp_text = (f"having played {total_matches} matches for {t}"
                    if total_matches > 0 else f"representing {t}")
 
        bat_milestone  = (f" and has smashed {centuries} career centuries"
                          if centuries > 0 and any(r in role for r in
                          ["Wicketkeeper","Batter","Batting All-Rounder"]) else "")
        bowl_milestone = (f" and has claimed {five_wickets} five-wicket hauls"
                          if five_wickets > 0 and any(r in role for r in
                          ["Bowling All-Rounder","All-Rounder","Bowler",
                           "Spin Bowler","Pace Bowler"]) else "")
 
        # ── Role-based random explanation pools ──────────────
        import random

        if is_anchor:
            anchor_pool = [
                f"{player_name} is a first-choice selection retained from the last XI vs {opponent_name}. A proven match-winner for {t}{bat_milestone}{bowl_milestone}, his experience and reliability make him indispensable in this lineup.",
                f"{player_name} holds his place from the last XI vs {opponent_name} and brings proven quality to {t}. His consistent performances{bat_milestone}{bowl_milestone} make him a automatic pick for this encounter.",
                f"{player_name} returns to the XI after featuring against {opponent_name} and has cemented his place through sheer performance. A dependable presence{bat_milestone}{bowl_milestone} who brings composure to the lineup.",
                f"{player_name} is retained from the last XI vs {opponent_name} as a key figure for {t}. His match-winning contributions{bat_milestone}{bowl_milestone} and big-game temperament make him essential.",
                f"{player_name} keeps his spot from the last XI vs {opponent_name}, having earned the selectors' trust through consistent displays. A reliable performer{bat_milestone}{bowl_milestone} who strengthens {t} significantly.",
                f"{player_name} is back in the XI after his showing against {opponent_name}, bringing vital experience to {t}. His adaptability{bat_milestone}{bowl_milestone} and game awareness make him a crucial team member.",
                f"{player_name} retains his position from the last XI vs {opponent_name}, continuing to be a cornerstone of {t}'s plans. His quality{bat_milestone}{bowl_milestone} and leadership on the field set him apart.",
            ]
            rs = random.choice(anchor_pool)

        elif "Wicketkeeper" in role:
            wk_pool = [
                f"{player_name} is the first-choice wicketkeeper for {t}, bringing exceptional glove work and important batting contributions to the lineup. His ability to read the game from behind the stumps gives the captain a vital tactical edge{bat_milestone}.",
                f"{player_name} is an elite wicketkeeper-batter who combines flawless keeping with aggressive batting. His presence behind the stumps ensures nothing goes to waste, while his bat provides crucial runs{bat_milestone} when the team needs them most.",
                f"{player_name} is a dynamic wicketkeeper who anchors {t}'s batting from behind the stumps. His sharp reflexes, clean glove work, and ability to build meaningful innings{bat_milestone} make him one of the most complete players in the lineup.",
                f"{player_name} is a reliable wicketkeeper-batter who sets the tone with his energy and skill behind the wicket. He contributes vital runs lower down the order{bat_milestone} and ensures the team never drops standards in the field.",
                f"{player_name} brings sharp wicketkeeping instincts and a dangerous bat to {t}'s XI. His ability to keep under pressure while also contributing with the bat{bat_milestone} makes him an invaluable dual-threat in this lineup.",
                f"{player_name} is the backbone behind the stumps for {t}, combining safe glove work with an eye for a big innings. His wicketkeeping marshals the bowling attack brilliantly while his batting{bat_milestone} adds firepower to the middle order.",
                f"{player_name} is a technically sound wicketkeeper who reads the game superbly for {t}. His swift glovework and ability to score crucial runs{bat_milestone} in pressure situations make him an essential member of this XI.",
                f"{player_name} is a fearless wicketkeeper-batter whose energy and skill galvanise {t}. His sharp reflexes behind the stumps and attacking instincts with the bat{bat_milestone} make him a constant threat throughout the match.",
            ]
            rs = random.choice(wk_pool)

        elif "Spin" in role and is_spin:
            spin_pitch_pool = [
                f"{player_name} is the standout spin weapon for the turning surface at {stadium}. His ability to extract sharp turn and generate uncomfortable bounce{bowl_milestone} makes him the most potent threat in these conditions.",
                f"{player_name} is tailor-made for the turning conditions at {stadium}, where his skill set comes into its own. His variety, flight, and ability to deceive batters through the air{bowl_milestone} make him extremely difficult to play on this surface.",
                f"{player_name} thrives on pitches like the one at {stadium} where the ball grips and turns. His control over line and length combined with his knack of taking wickets at crucial moments{bowl_milestone} makes him a match-winner here.",
                f"{player_name} is the go-to spin option on the turning track at {stadium}. He generates significant drift before pitching and sharp turn off the surface{bowl_milestone}, making him a constant threat against any batting lineup in these conditions.",
                f"{player_name} relishes spin-friendly conditions at {stadium} and is at his most dangerous on pitches like this. His ability to bowl long spells while maintaining accuracy and inviting the drive{bowl_milestone} makes him a real handful.",
                f"{player_name} is a master craftsman on turning tracks like {stadium}, where he can exploit the surface to his advantage. His subtle variations in pace and flight{bowl_milestone} make him a nightmarish prospect for batters on this pitch.",
                f"{player_name} is perfectly suited for the conditions at {stadium}, where the pitch is set to assist his style of bowling. His ability to grip the ball and generate movement both ways{bowl_milestone} makes him the key spin option.",
                f"{player_name} is a wily spin bowler who knows exactly how to exploit a turning wicket at {stadium}. His tactical awareness, ability to read batters, and disguised variations{bowl_milestone} give him a significant advantage in these conditions.",
            ]
            rs = random.choice(spin_pitch_pool)

        elif "Pace" in role and is_pace:
            pace_pitch_pool = [
                f"{player_name} is the premier pace weapon for the {pitch_assist} conditions at {stadium}. His raw pace and ability to generate awkward bounce and movement{bowl_milestone} make him the most potent threat in the attack.",
                f"{player_name} is ideally suited for the {pitch_assist} track at {stadium}, where he can extract maximum assistance from the surface. His skill with the new ball and ability to bowl long spells at high intensity{bowl_milestone} make him a major threat.",
                f"{player_name} relishes pace-friendly conditions at {stadium} and will be looking to make an early impact. His sharp bouncer, disciplined line, and ability to swing the ball both ways{bowl_milestone} make him a handful in these conditions.",
                f"{player_name} is a fearsome pace bowler who comes alive on surfaces like {stadium}. His aggression, control, and ability to trouble even the best batters with pace and movement{bowl_milestone} make him the standout bowler in this attack.",
                f"{player_name} thrives at {stadium} where the pace and bounce assist his style of bowling perfectly. His ability to consistently hit challenging lengths and trouble batters with sheer pace{bowl_milestone} makes him a vital pick in these conditions.",
                f"{player_name} is a skilled pace bowler who knows how to exploit the {pitch_assist} surface at {stadium}. His mastery of swing and seam movement{bowl_milestone} makes him an extremely difficult proposition for any batting lineup.",
                f"{player_name} is an aggressive pace option selected specifically for the conditions at {stadium}. His ability to build sustained pressure, take early wickets, and unsettle batters with raw pace{bowl_milestone} makes him essential in this attack.",
                f"{player_name} is a clinical pace bowler who maximises every opportunity on surfaces like {stadium}. His tactical intelligence, ability to read batters and deliver precisely at crucial moments{bowl_milestone} makes him a match-winner here.",
            ]
            rs = random.choice(pace_pitch_pool)

        elif "Spin" in role and opp_spin_v:
            spin_opp_pool = [
                f"{player_name} is a shrewd tactical selection to exploit {opponent_name}'s well-documented weakness against spin bowling. His ability to deceive through flight and extract sharp turn{bowl_milestone} gives him a significant advantage against this batting lineup.",
                f"{player_name} is brought in specifically to target {opponent_name}'s vulnerability against quality spin. His variations, control, and ability to build pressure relentlessly{bowl_milestone} make him the ideal candidate to expose this weakness.",
                f"{player_name} has been identified as the key spin weapon to attack {opponent_name}'s frailties with the turning ball. His guile, experience, and knack of taking wickets when it matters most{bowl_milestone} make him a dangerous selection.",
                f"{player_name} is a calculated inclusion designed to exploit {opponent_name}'s struggles against spin bowling. His skill in extracting awkward turn and maintaining disciplined lines{bowl_milestone} gives {t} a significant tactical advantage.",
                f"{player_name} is precisely the type of bowler to cause chaos in {opponent_name}'s batting order, who have repeatedly been exposed by spin. His subtle variations and ability to create false shots{bowl_milestone} make him an excellent pick for this encounter.",
                f"{player_name} is selected with a clear plan to dismantle {opponent_name}'s batting lineup, who struggle against quality spin. His ability to deceive, extract turn, and bowl in crucial phases{bowl_milestone} makes him a match-winning selection.",
            ]
            rs = random.choice(spin_opp_pool)

        elif "Pace" in role and opp_pace_v:
            pace_opp_pool = [
                f"{player_name} is selected with a clear plan to exploit {opponent_name}'s technical weakness against pace bowling. His ability to consistently hit the right length and trouble batters with pace and movement{bowl_milestone} gives {t} a tactical edge.",
                f"{player_name} is a calculated pick to target {opponent_name}'s vulnerability against quality fast bowling. His skill in generating extra pace, uncomfortable bounce, and movement{bowl_milestone} makes him perfectly suited to cause damage.",
                f"{player_name} has the firepower to expose {opponent_name}'s persistent frailties against pace. His ability to bowl hostile spells, vary his pace cleverly, and take crucial wickets{bowl_milestone} makes him an inspired selection for this match.",
                f"{player_name} is brought in to relentlessly attack {opponent_name}'s batters, who have consistently struggled with quality pace bowling. His aggression, skill, and ability to maintain high intensity{bowl_milestone} over long spells make him the perfect weapon.",
                f"{player_name} is selected to ruthlessly expose {opponent_name}'s weakness against pace, having identified this as a key tactical opportunity. His ability to hit hard lengths, generate bounce and extract movement{bowl_milestone} makes him essential here.",
                f"{player_name} is precisely the type of bowler to exploit {opponent_name}'s technical frailties against fast bowling. His fierce pace, intelligent variations, and ability to strike at important junctures{bowl_milestone} make him an excellent tactical pick.",
            ]
            rs = random.choice(pace_opp_pool)

        elif is_high and role in ["Batter","Batting All-Rounder","Wicketkeeper"]:
            high_bat_pool = [
                f"{player_name} is a must-have batting asset for the high-scoring conditions at {stadium}, where big totals are expected. His ability to attack from the outset, clear the boundary effortlessly, and build huge partnerships{bat_milestone} makes him perfect for this batting paradise.",
                f"{player_name} thrives in high-scoring environments and is tailor-made for the conditions at {stadium}. His aggressive intent, powerful hitting, and ability to capitalise on flat pitches{bat_milestone} make him a dangerous proposition in this match.",
                f"{player_name} is the ideal batting pick for the run-fest expected at {stadium}, where boundaries are at a premium. His calculated aggression, ability to accelerate at will, and supreme confidence against any bowling attack{bat_milestone} make him indispensable.",
                f"{player_name} is in his element at high-scoring venues like {stadium}, where his attacking style perfectly suits the conditions. His ability to dominate bowlers, manufacture shots, and chase or post imposing totals{bat_milestone} makes him a key selection.",
                f"{player_name} is a prolific run-scorer who comes into his own at batting-friendly venues like {stadium}. His technique against both pace and spin, combined with his natural flair and timing{bat_milestone}, makes him a dangerous force in these conditions.",
                f"{player_name} excels on high-scoring surfaces like {stadium}, where his quality shines brightest. His ability to build a match-winning innings, rotate the strike intelligently, and punish loose deliveries{bat_milestone} makes him essential in this lineup.",
                f"{player_name} is selected as the batting powerhouse for the high-scoring encounter at {stadium}. His phenomenal ability to score at a rapid rate, convert starts into big innings, and dominate the bowling attack{bat_milestone} makes him a crucial selection.",
                f"{player_name} is a natural fit for the high-scoring conditions at {stadium}, where batters are expected to dominate. His elegant strokeplay, ability to control the tempo, and knack of scoring big when it matters most{bat_milestone} make him essential.",
            ]
            rs = random.choice(high_bat_pool)

        elif is_low and role in ["Bowler","Spin Bowler","Pace Bowler","Bowling All-Rounder"]:
            low_bowl_pool = [
                f"{player_name} is the standout bowling asset for the challenging low-scoring conditions at {stadium}, where wickets are the currency of success. His ability to exploit the surface, maintain discipline, and take wickets at crucial moments{bowl_milestone} makes him essential.",
                f"{player_name} is a master of bowling in difficult conditions like those at {stadium}, where the pitch assists the bowlers. His skill in varying pace, hitting precise lines, and creating repeated chances against even the best batters{bowl_milestone} makes him the key weapon.",
                f"{player_name} relishes the challenge of bowling on a low-scoring track at {stadium}, where his technical skills come to the fore. His ability to extract movement from the surface, build sustained pressure, and deliver in clutch moments{bowl_milestone} makes him a match-winner.",
                f"{player_name} thrives in bowler-friendly conditions at {stadium}, where the match is expected to be a close, low-scoring contest. His accuracy, ability to hit back-of-a-length consistently, and clinical wicket-taking{bowl_milestone} make him the standout pick.",
                f"{player_name} is perfectly suited for the challenging conditions at {stadium}, where every wicket is precious. His mastery over line and length, intelligent use of the conditions, and ability to take wickets in partnerships{bowl_milestone} make him invaluable.",
                f"{player_name} is a vital inclusion for the low-scoring encounter expected at {stadium}. His ability to bowl economically, create pressure from one end, and break crucial partnerships at key moments{bowl_milestone} makes him an essential member of this attack.",
            ]
            rs = random.choice(low_bowl_pool)

        elif "Batter" in role and "All-Rounder" not in role:
            bat_pool = [
                f"{player_name} is a cornerstone of {t}'s batting lineup, bringing elegance, power, and match-winning ability to every innings. His ability to build a big knock, rotate the strike intelligently, and punish any loose delivery{bat_milestone} makes him indispensable.",
                f"{player_name} is a classy, composed batter who anchors {t}'s innings with grace and authority. His outstanding technique against both pace and spin, combined with the ability to accelerate when the situation demands{bat_milestone}, makes him a key selection.",
                f"{player_name} is a dynamic top-order batter who can single-handedly change the course of a match for {t}. His attacking intent, sharp eye for the right ball to hit, and ability to take the game away from the opposition{bat_milestone} make him essential.",
                f"{player_name} is a technically gifted batter who brings solidity and class to the top of {t}'s batting order. His ability to face down any bowling attack, build patient but effective innings, and convert starts into match-winning scores{bat_milestone} is exceptional.",
                f"{player_name} is a vital cog in {t}'s batting machine, capable of both anchor and aggressor roles depending on the team's needs. His brilliant footwork, superb shot selection, and ability to keep the scoreboard moving{bat_milestone} make him outstanding.",
                f"{player_name} is a prolific run-scorer who consistently delivers for {t} when the team needs him most. His class against quality bowling, ability to read the game brilliantly, and match-winning contributions in pressure situations{bat_milestone} make him essential.",
                f"{player_name} is one of {t}'s most reliable batting weapons, bringing a blend of aggression and composure to the lineup. His natural batting talent, ability to adapt quickly to conditions, and knack of rising to big occasions{bat_milestone} make him outstanding.",
                f"{player_name} is a batting powerhouse for {t} who offers both explosive scoring and technical resilience. His extraordinary ability to dominate the best bowlers, build crucial partnerships, and bat deep into the innings{bat_milestone} makes him invaluable.",
                f"{player_name} is a consistent match-winner for {t} whose batting quality speaks for itself. His magnificent ability to read the conditions early, play the right shots at the right time, and deliver under pressure{bat_milestone} sets him apart.",
                f"{player_name} is a dependable batting presence for {t}, bringing both technical soundness and the ability to play big innings. His brilliant game awareness, sound defensive technique, and ability to accelerate brilliantly at the death{bat_milestone} make him a key pick.",
            ]
            rs = random.choice(bat_pool)

        elif "Batting All-Rounder" in role:
            bat_ar_pool = [
                f"{player_name} is a complete batting all-rounder who covers every base for {t}, contributing meaningfully with both bat and ball throughout the match. His ability to bat at any position in the order and bowl crucial overs{bat_milestone}{bowl_milestone} makes him truly invaluable.",
                f"{player_name} is a dynamic batting all-rounder who adds firepower and balance to {t}'s lineup. His aggressive batting instincts combined with his ability to bowl key breakthrough overs{bat_milestone}{bowl_milestone} make him one of the most versatile players in the XI.",
                f"{player_name} is the ultimate impact player for {t}, capable of winning matches with both bat and ball. His explosive batting in the middle order and ability to contribute crucial overs with the ball{bat_milestone}{bowl_milestone} make him an indispensable selection.",
                f"{player_name} is a gifted all-rounder who strengthens every aspect of {t}'s game. His elegant batting, useful bowling, and exceptional fielding{bat_milestone}{bowl_milestone} provide the captain with enormous tactical flexibility throughout the match.",
                f"{player_name} is a natural match-winner who thrives under pressure for {t}. His ability to walk in at a critical moment and turn the game with the bat, or take a vital wicket when needed{bat_milestone}{bowl_milestone}, makes him an extraordinarily valuable team member.",
                f"{player_name} is a brilliant batting all-rounder who elevates {t}'s overall quality significantly. His fluent strokeplay, ability to accelerate at will, and knack for bowling at the right moment{bat_milestone}{bowl_milestone} make him a captain's dream in this XI.",
                f"{player_name} is a tireless, versatile contributor for {t} who makes his mark in every game. His smart batting, ability to bowl exactly when the captain requires him, and outstanding work in the field{bat_milestone}{bowl_milestone} make him absolutely essential.",
                f"{player_name} is a sophisticated batting all-rounder who adds depth and elegance to {t}'s lineup. His ability to build a quality innings at any point and contribute with the ball in pressure overs{bat_milestone}{bowl_milestone} makes him an excellent selection.",
            ]
            rs = random.choice(bat_ar_pool)

        elif "Bowling All-Rounder" in role or "All-Rounder" in role:
            bowl_ar_pool = [
                f"{player_name} is a match-winning bowling all-rounder who contributes decisively with both bat and ball for {t}. His ability to take crucial wickets, maintain consistent pressure, and contribute handy runs lower down the order{bowl_milestone}{bat_milestone} makes him truly invaluable.",
                f"{player_name} is a fierce, disciplined bowling all-rounder who is the perfect team player for {t}. His ability to bowl long spells at high intensity, take key wickets in clusters, and contribute lusty blows with the bat{bowl_milestone}{bat_milestone} makes him essential.",
                f"{player_name} is a dynamic all-rounder whose bowling aggression and lower-order hitting make him a match-winner for {t}. His skill at taking wickets in important phases and scoring quick runs when required{bowl_milestone}{bat_milestone} makes him invaluable.",
                f"{player_name} is a smart, calculating bowling all-rounder who always plays a significant role for {t}. His ability to build pressure relentlessly, take wickets in partnership-breaking spells, and play a useful cameo with the bat{bowl_milestone}{bat_milestone} makes him outstanding.",
                f"{player_name} is a genuine all-round threat who gives {t} the perfect balance in the XI. His ability to bowl hostile spells, take important wickets, and provide crucial lower-order runs when the team is under pressure{bowl_milestone}{bat_milestone} makes him essential.",
                f"{player_name} is a versatile, high-impact bowling all-rounder who covers multiple roles brilliantly for {t}. His clever variations with the ball, consistent wicket-taking ability, and ability to score crucial runs{bowl_milestone}{bat_milestone} make him an excellent selection.",
                f"{player_name} is an aggressive bowling all-rounder whose energy and skill lift the entire {t} team. His ability to deliver breakthroughs on demand, maintain relentless pressure, and contribute important batting cameos{bowl_milestone}{bat_milestone} make him vital.",
                f"{player_name} is a world-class bowling all-rounder who is always at the heart of {t}'s success. His brilliant ability to read batters and deliver against them, combined with valuable lower-order hitting{bowl_milestone}{bat_milestone}, makes him a first-choice selection.",
            ]
            rs = random.choice(bowl_ar_pool)

        elif "Spin" in role:
            spin_pool = [
                f"{player_name} is a wily spin bowler who is a constant threat throughout the match for {t}. His ability to deceive batters through the air, extract sharp turn from the pitch, and build sustained pressure{bowl_milestone} makes him a key member of this attack.",
                f"{player_name} is a skillful spin bowler who brings craft and intelligence to {t}'s bowling attack. His subtle variations in flight, pace, and turn{bowl_milestone} keep batters perpetually guessing and under pressure throughout the innings.",
                f"{player_name} is a masterful spin option for {t} who consistently controls the tempo of the game. His ability to bowl tightly at crucial moments, take wickets in key phases, and dry up the runs effectively{bowl_milestone} makes him an outstanding selection.",
                f"{player_name} is a classical spin bowler who gives {t} a completely different dimension in the attack. His beautiful flight, ability to extract unexpected turn, and variations that consistently create uncertainty in the batter's mind{bowl_milestone} make him dangerous.",
                f"{player_name} is a gifted spinner who is at his best when the match is on the line for {t}. His composure under pressure, ability to flight the ball invitingly, and knack of taking wickets when they matter most{bowl_milestone} make him an essential pick.",
                f"{player_name} is a reliable spin option who adds variety, control, and match-winning potential to {t}'s attack. His ability to consistently hit the right areas, build partnerships between overs, and take the all-important breakthrough wicket{bowl_milestone} make him vital.",
                f"{player_name} is a canny spin operator who knows exactly how to get the best out of any surface for {t}. His vast experience, ability to vary between attack and containment beautifully, and consistent wicket-taking{bowl_milestone} make him an excellent selection.",
                f"{player_name} is a dangerous, attacking spinner who makes batting look difficult for any opposition. His sharp turn, clever disguise on the quicker ball, and ability to consistently create false shots{bowl_milestone} make him one of {t}'s most potent weapons.",
                f"{player_name} is a complete spinner who brings every tool of the trade to {t}'s bowling lineup. His brilliant ability to read the batter, change his angles subtly, and deliver at exactly the right moment{bowl_milestone} makes him indispensable.",
                f"{player_name} is an experienced, intelligent spin bowler who consistently rises to the occasion for {t}. His tactical acumen, ability to adjust beautifully to conditions and batter preferences, and match-winning deliveries{bowl_milestone} make him an exceptional pick.",
            ]
            rs = random.choice(spin_pool)

        elif "Pace" in role:
            pace_pool = [
                f"{player_name} is a fearsome pace bowler who is one of {t}'s most potent weapons in any conditions. His raw, blistering pace, ability to generate awkward lift from a length, and skill to swing the ball dangerously{bowl_milestone} make him a nightmare for any batter.",
                f"{player_name} is a skilled, aggressive fast bowler who consistently troubles the world's best batters for {t}. His mastery of reverse swing, clever use of the bouncer, and ability to bowl at high pace for long spells{bowl_milestone} make him truly dangerous.",
                f"{player_name} is a clinical pace bowler who always delivers for {t} when his team needs him most. His outstanding control over line and length, ability to generate sharp movement both ways, and composure in the most pressurised situations{bowl_milestone} make him outstanding.",
                f"{player_name} is an express pace bowler who gives {t} a clear edge with the ball in hand. His electrifying speed, awkward bounce, and ability to unsettle even the most accomplished batters{bowl_milestone} make him one of the most dangerous bowlers in the world.",
                f"{player_name} is a versatile, clever fast bowler who can operate in any phase of the game for {t}. His ability to swing the new ball brilliantly, reverse it later, and bowl hostile bouncers with precision{bowl_milestone} makes him extraordinarily difficult to face.",
                f"{player_name} is a consistent, high-quality pace bowler who is always making things happen for {t}. His ability to hit the seam repeatedly, generate sideways movement, and take important wickets in clusters{bowl_milestone} makes him an automatic selection.",
                f"{player_name} is a relentless, high-intensity pace bowler who never gives the batter a moment to breathe. His extraordinary ability to maintain fierce pace for long periods, consistently hit good lengths, and take wickets on any surface{bowl_milestone} makes him essential.",
                f"{player_name} is an intelligent, crafty pace bowler who constantly outsmarts batters with his variations. His ability to bowl the perfect yorker at the death, generate extra bounce with the old ball, and take crucial wickets{bowl_milestone} make him an outstanding pick.",
                f"{player_name} is a match-winning fast bowler whose performances have repeatedly turned games in {t}'s favour. His supreme pace, aggressive mindset, and ability to produce unplayable deliveries in the most pressurised moments{bowl_milestone} make him indispensable.",
                f"{player_name} is one of the most complete pace bowlers in the game and a vital asset for {t}. His mastery of every weapon in the fast bowler's arsenal — swing, seam, pace, and bounce{bowl_milestone} — makes him an exceptional selection for any conditions.",
            ]
            rs = random.choice(pace_pool)

        else:
            pa_desc = pitch_assist if pitch_assist != "Unknown" else "current conditions"
            general_pool = [
                f"{player_name} is a specialist {role.lower()} who is perfectly suited for the {pa_desc} at {stadium}. His expertise in reading conditions quickly and adapting his game accordingly{bowl_milestone} makes him an excellent and well-considered selection for this XI.",
                f"{player_name} is a highly skilled {role.lower()} who brings match-winning quality to {t}'s lineup for the {pa_desc} conditions at {stadium}. His ability to consistently perform under pressure and deliver in key moments{bowl_milestone} makes him an outstanding pick.",
                f"{player_name} is a valuable {role.lower()} whose skills are perfectly calibrated for the {pa_desc} surface at {stadium}. His experience in similar conditions and ability to make a decisive impact{bowl_milestone} make him an important and thoughtful selection.",
            ]
            rs = random.choice(general_pool)
 
        results.append({
                "player_name": str(player_name),
                "role"       : str(role),
                "team"       : str(row.get("team", t)),
                "probability": float(prob_pct),
                "reason"     : str(rs),
            })
 
    # ── Key player and team strength ──────────────────────
    kp_row = final_xi.nlargest(1, "probability").iloc[0]
 
    bowler_roles = ["Bowler","Spin Bowler","Pace Bowler","Bowling All-Rounder"]
    spinners = final_xi[final_xi["role"]=="Spin Bowler"]
    pacers   = final_xi[final_xi["role"]=="Pace Bowler"]
    bowlers  = final_xi[final_xi["role"].isin(bowler_roles)]
    ars      = final_xi[final_xi["role"].str.contains("All-Rounder", na=False)]
    batters  = final_xi[final_xi["role"].isin(["Batter","Wicketkeeper","Batting All-Rounder"])]
    avg_sr   = batters["strike_rate"].mean() if not batters.empty else 0
    total_wk = final_xi["wickets"].sum()
    ar_count = len(ars)
 
    if len(bowlers) > 4:
        strength = "Heavy Bowling Artillery"
    elif avg_sr > 140:
        strength = "High-Octane Power Hitting"
    elif ar_count >= 4:
        strength = "Versatile All-Round Dominance"
    elif total_wk > 150:
        strength = "Experienced Strike Force"
    else:
        strength = "Balanced Tactical Setup"

    return {
        "players"   : results,
        "key_player": str(kp_row.get("player_name", "N/A")),
        "key_role"  : str(kp_row.get("role",        "N/A")),
        "strength"  : str(strength),
        "spin_count": int(len(spinners)),
        "pace_count": int(len(pacers)),
        "opp_analysis": {
            "batting_strength": str(opp["opp_batting_strength"]),
            "avg_bat_avg"     : float(opp["opp_avg_bat_avg"]),
            "spin_vulnerable" : bool(opp["opp_spin_vulnerable"]),
            "pace_vulnerable" : bool(opp["opp_pace_vulnerable"]),
        }
    }
 
# =========================================================
# MAIN PREDICTION ENDPOINT
# =========================================================@app.post("/predict/probable11")
@app.post("/predict/probable11")
def predict_probable11(req: MatchRequest):
 
    fmt_clean = req.format.strip().upper()
 
    if "ODI" in fmt_clean:
        master = odi_master; model = clf_odi; lineups = lineups_odi
    elif "T20" in fmt_clean:
        master = t20_master; model = clf_t20; lineups = lineups_t20
    else:
        master = test_master; model = clf_test; lineups = lineups_test
 
    # Runs extraction cleanly with cross-checked mappings
    venue = get_venue_profile(req.venue, fmt_clean)
    
    if not venue or not isinstance(venue, dict):
        venue = {}

    req_venue_clean = str(req.venue).strip().lower()
    db_city = venue.get("city", "Unknown")
    db_country = venue.get("country", "Unknown")

    # Emergency keyword parsing fallbacks
    if db_city == "Unknown" or db_city == "nan":
        if "kolkata" in req_venue_clean or "eden" in req_venue_clean:
            db_city, db_country = "Kolkata", "India"
        elif "mumbai" in req_venue_clean or "wankhede" in req_venue_clean:
            db_city, db_country = "Mumbai", "India"
        elif "ahmedabad" in req_venue_clean or "narendra modi" in req_venue_clean:
            db_city, db_country = "Ahmedabad", "India"
        elif "melbourne" in req_venue_clean or "mcg" in req_venue_clean:
            db_city, db_country = "Melbourne", "Australia"
        elif "london" in req_venue_clean or "lord" in req_venue_clean:
            db_city, db_country = "London", "England"

    if str(db_city).lower() == "nan" or not db_city: db_city = "Unknown"
    if str(db_country).lower() == "nan" or not db_country: db_country = "Unknown"

    venue["city"] = db_city
    venue["country"] = db_country

    # ── CONDITION GENERATION ──
    is_high, is_low, is_spin, is_pace = classify_conditions(venue, fmt_clean)
    pitch_summary = []
    if is_spin:  pitch_summary.append("Spin-friendly")
    if is_pace:  pitch_summary.append("Pace-friendly")
    if is_high:  pitch_summary.append("High-scoring / Batting paradise")
    elif is_low: pitch_summary.append("Low-scoring / Bowling paradise")
    if not pitch_summary: pitch_summary.append("Balanced")

    t1_res = get_probable_11_internal(
        req.team1, req.team2, master, model, fmt_clean, venue, lineups)
    t2_res = get_probable_11_internal(
        req.team2, req.team1, master, model, fmt_clean, venue, lineups)

    outlook = (
        f"As {req.team1} prepares to face {req.team2} at {venue.get('stadium') or req.venue}, "
        f"the stage is set for a high-stakes encounter. "
        f"Surface analysis indicates {' | '.join(pitch_summary)} conditions — "
        f"runs per over average of {float(venue.get('rpo', 0.0)):.2f} suggests "
        f"{'a batters\' paradise' if is_high else 'bowlers will have the edge' if is_low else 'a balanced contest'}. "
        f"Pitch assist: {venue.get('pitch_assist', 'N/A')}. "
        f"Discipline in the middle overs will be the key differentiator."
    )

    return {
        "success": True,
        "data": {
            "match_info": {
                "team1" : req.team1,
                "team2" : req.team2,
                "format": req.format,
                "venue" : req.venue,
            },
            "venue_details": {
                "stadium"       : venue.get("ground_name") or venue.get("stadium") or str(req.venue),
                "city"          : db_city,
                "country"       : db_country,
                "pitch_type"    : venue.get("pitch_type") or venue.get("pitch_surface") or "Unknown",
                "pitch_assist"  : venue.get("pitch_assist") or "Unknown",
                "scoring_nature": venue.get("scoring") or venue.get("scoring_nature") or "Unknown",
                "rpo"           : float(venue.get("rpo", 0.0)),
                "rpw"           : float(venue.get("rpw", 0.0)),
                "matches_played": int(venue.get("matches_played", 0)),
                "conditions"    : " | ".join(pitch_summary),
            },
            "match_outlook" : outlook,
            "team1_results" : t1_res,
            "team2_results" : t2_res,
        }
    }
# =========================================================
# HEALTH CHECK
# =========================================================
@app.get("/health")
def health():
    return {
        "status" : "healthy",
        "models" : {
            "t20": clf_t20 is not None,
            "odi": clf_odi is not None,
            "test": clf_test is not None,
        },
        "data_loaded": {
            "t20_master" : len(t20_master),
            "odi_master" : len(odi_master),
            "test_master": len(test_master),
            "venues"     : len(venues_df),
        }
    }
 
# =========================================================
# REVIEW ENDPOINT (unchanged logic, kept intact)
# =========================================================
@app.post("/review/generate")
def get_match_review(req: ReviewRequest):
    global review_master
    if review_master is None or review_master.empty:
        return {"error": "Review database is empty."}
    try:
        fmt_input  = str(req.format).strip().upper()
        date_raw   = str(req.match_date).strip()  # arrives as YYYY-MM-DD

        # Convert YYYY-MM-DD → YY/MM/DD to match review_master.csv format (e.g. 26/03/08)
        try:
            parts = date_raw.split("-")   # ["2026", "03", "08"]
            yy    = parts[0][-2:]         # "26"
            mm    = parts[1]             # "03"
            dd    = parts[2]             # "08"
            date_input = f"{yy}/{mm}/{dd}"  # "26/03/08"  ← CORRECT order
        except Exception:
            date_input = date_raw

        # Also handle format column which may say "T20 WC" etc, not just "T20"
        fmt_input_search = fmt_input  # keep original for innings logic
        
        t1_input = str(req.team1).strip().lower()
        t2_input = str(req.team2).strip().lower()

        # Format filter: use .str.contains instead of == to catch "T20 WC", "ODI Series" etc
        mask = (
            (review_master["Format"].astype(str).str.strip().str.upper().str.contains(fmt_input, na=False)) &
            (review_master["Date"].astype(str).str.contains(date_input, na=False))
        )
        
        matches = review_master[mask]
        
        if matches.empty:
            return {"error": f"No match found for {fmt_input} on {date_input}"}

        # Refine matching dynamically to handle abbreviations safely across all inputs
        def team_match_filter(row):
            def get_variations(name):
                n = name.strip().lower()
                v = [n]
                if len(n) >= 3:
                    v.append(n[:3])
                aliases = {
                    "new zealand": ["nz", "new zealand"],
                    "south africa": ["sa", "south africa"],
                    "west indies": ["wi", "west indies"],
                    "india": ["ind", "india"],
                    "australia": ["aus", "australia"],
                    "england": ["eng", "england"],
                    "pakistan": ["pak", "pakistan"],
                    "sri lanka": ["sl", "sri lanka"],
                    "bangladesh": ["ban", "bangladesh"],
                    "afghanistan": ["afg", "afghanistan"],
                    "ireland": ["ire", "ireland"],
                    "zimbabwe": ["zim", "zimbabwe"],
                }
                if n in aliases:
                    v.extend(aliases[n])
                return list(set(v))

            t1_vars = get_variations(t1_input)
            t2_vars = get_variations(t2_input)

            # Read the comprehensive Search_Field column and force lower-case
            search_field_dump = str(row.get("Search_Field", "")).strip().lower()
            series_dump = str(row.get("Series", "")).strip().lower()
            
            # Combine them to make a bulletproof searchable block
            match_block = f"{series_dump} {search_field_dump}"

            has_t1 = any(var in match_block for var in t1_vars)
            has_t2 = any(var in match_block for var in t2_vars)
            
            return has_t1 and has_t2

        refined_matches = matches[matches.apply(team_match_filter, axis=1)]
        if not refined_matches.empty:
            matches = refined_matches
        else:
            return {"error": f"Match found on {date_input}, but not between {req.team1} and {req.team2}."}

        m = matches.iloc[-1]

        def format_inn(prefix):
            runs = m.get(f"{prefix}_Runs", "0")
            wkts = m.get(f"{prefix}_Wkts", "0")
            # Clear trailing float decimals like "240.0" from pandas dataframes conversion
            if isinstance(runs, float) or (isinstance(runs, str) and runs.endswith('.0')):
                runs = str(int(float(runs)))
            if isinstance(wkts, float) or (isinstance(wkts, str) and wkts.endswith('.0')):
                wkts = str(int(float(wkts)))
            return f"{runs}/{wkts}"

        scores = {"inn1": format_inn("1st_Inn"), "inn2": format_inn("2nd_Inn")}
        venue         = m.get("Venue", "the venue")
        result        = m.get("Result", "N/A")
        series        = m.get("Series", "this series")
        toss_winner   = m.get("Toss_Winner", "N/A")
        toss_decision = m.get("Toss_Decision", "N/A")
        pom_info = ""

        if fmt_input == "TEST":
            scores["inn3"] = format_inn("3rd_Inn")
            scores["inn4"] = format_inn("4th_Inn")
        else:
            scores["inn3"] = None
            scores["inn4"] = None
            pom_name = m.get("POM", "N/A")
            if pom_name != "N/A":
                pom_info = f" For his outstanding contribution, {pom_name} was awarded Player of the Match."

        analysis = (
            f"The encounter at {venue} proved to be a riveting chapter of {series}. "
            f"The tactical battle began at the toss where {toss_winner} elected to "
            f"{toss_decision}, setting the tone for a high-intensity clash. "
            f"Both sides displayed exceptional skill and resilience throughout. "
            f"Ultimately, clinical execution in pressure moments allowed a decisive finish. "
            f"The final verdict was {result}, capping a memorable performance.{pom_info}"
        )

        return {
            "success"        : True,
            "match_title"    : str(series),
            "date"           : str(m.get("Date", "")),
            "venue"          : str(venue),
            "toss"           : f"{toss_winner} won & chose to {toss_decision}",
            "final_result"   : str(result),
            "player_of_match": None,
            "summary"        : analysis,
            "scores"         : scores,
        }
    except Exception as e:
        return {"error": f"Internal error: {str(e)}"}
    
# =========================================================
# LINEUPS ENDPOINT
# =========================================================
@app.get("/lineups/get")
def get_lineups(team1: str, team2: str, format: str):
    fmt = format.strip().upper()
    if "ODI" in fmt:
        lineup_dict = lineups_odi
    elif "T20" in fmt:
        lineup_dict = lineups_t20
    else:
        lineup_dict = lineups_test

    def find_lineup(batting_team, opponent):
        if batting_team not in lineup_dict:
            return []
        opp_lineups = lineup_dict[batting_team]
        matched_key = next(
            (k for k in opp_lineups
             if opponent.lower() in k.lower() or k.lower() in opponent.lower()), None)
        if not matched_key:
            return []
        return [str(p) for p in opp_lineups[matched_key] if str(p).strip()]

    return {
        "format": fmt,
        "team1_lineup": find_lineup(team1, team2),
        "team2_lineup": find_lineup(team2, team1),
    }    