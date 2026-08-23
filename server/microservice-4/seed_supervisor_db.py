"""
Supervisor Data Preparation Script (Final Version)
------------------------------------------------
Populates 'WP' database with a complete set of 5 collections:
1. win predictor       - Historical ML training data
2. rankings            - Team rankings across formats
3. recent performances - Performance logs for analysis
4. teams               - Team profiles & core stats
5. head to head        - Pairwise historical records
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import random

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["WP"]

TEAMS_LIST = ["India", "Australia", "England", "South Africa", "New Zealand", "Pakistan", "Sri Lanka", "West Indies"]

def seed_teams():
    coll = db["teams"]
    coll.drop()
    data = [
        {"name": "India", "rank_t20": 1, "form": 85, "home_strength": 95, "away_strength": 75},
        {"name": "Australia", "rank_t20": 2, "form": 82, "home_strength": 90, "away_strength": 80},
        {"name": "England", "rank_t20": 3, "form": 75, "home_strength": 85, "away_strength": 70},
        {"name": "South Africa", "rank_t20": 4, "form": 70, "home_strength": 85, "away_strength": 65},
        {"name": "New Zealand", "rank_t20": 5, "form": 72, "home_strength": 80, "away_strength": 65},
        {"name": "Pakistan", "rank_t20": 6, "form": 65, "home_strength": 75, "away_strength": 60},
        {"name": "Sri Lanka", "rank_t20": 8, "form": 60, "home_strength": 75, "away_strength": 50},
        {"name": "West Indies", "rank_t20": 7, "form": 65, "home_strength": 70, "away_strength": 50},
    ]
    coll.insert_many(data)
    print("[*] Created collection: teams")

def seed_h2h():
    coll = db["head to head"]
    coll.drop()
    data = []
    # Generate some key pairs
    pairs = [("India", "Australia"), ("India", "Pakistan"), ("Australia", "England"), ("South Africa", "India")]
    for t1, t2 in pairs:
        data.append({
            "team1": t1, "team2": t2,
            "team1_win_pct": round(random.uniform(0.45, 0.75), 2),
            "total_matches": random.randint(80, 150),
            "updated_at": datetime.now(timezone.utc)
        })
    coll.insert_many(data)
    print("[*] Created collection: head to head")

def seed_rankings():
    coll = db["rankings"]
    coll.drop()
    data = [
        {"team": "India", "t20": 1, "odi": 1, "test": 2},
        {"team": "Australia", "t20": 2, "odi": 2, "test": 1},
        {"team": "England", "t20": 3, "odi": 4, "test": 3},
        {"team": "South Africa", "t20": 4, "odi": 3, "test": 4}
    ]
    coll.insert_many(data)
    print("[*] Created collection: rankings")

def seed_performances():
    coll = db["recent performances"]
    coll.drop()
    data = []
    for team in TEAMS_LIST[:4]: # Top 4 teams for brevity
        for _ in range(3):
            data.append({
                "team": team, "result": random.choice(["Won", "Lost"]),
                "opponent": random.choice([t for t in TEAMS_LIST if t != team]),
                "date": datetime.now().strftime("%Y-%m-%d")
            })
    coll.insert_many(data)
    print("[*] Created collection: recent performances")

def seed_win_predictor():
    coll = db["win predictor"]
    coll.drop()
    data = [{"match": f"Sample {i}", "prediction": random.choice(TEAMS_LIST), "confidence": f"{random.randint(60,90)}%"} for i in range(10)]
    coll.insert_many(data)
    print("[*] Created collection: win predictor")

if __name__ == "__main__":
    print(f"[*] Finalizing Master Supervisor Database: WP")
    seed_teams()
    seed_h2h()
    seed_rankings()
    seed_performances()
    seed_win_predictor()
    print("\n[SUCCESS] WP Database now contains all 5 required collections!")
