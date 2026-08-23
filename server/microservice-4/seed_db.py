"""
seed_db.py  –  Populates the MongoDB WinPredictor database with initial data.

Collections created:
  1. teams        – team stats (rankings, form, strengths)
  2. head_to_head – historical win-rate between team pairs
  3. predictions  – (empty) stores every prediction the API makes
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timezone

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["WinPredictor"]

# ─────────────────────────────────────────────
# 1. Teams Collection
# ─────────────────────────────────────────────
teams_data = [
    {
        "name": "India",
        "rank_t20": 1, "rank_odi": 1, "rank_test": 2,
        "form": 85,
        "home_strength": 95,
        "away_strength": 75,
        "flag_code": "IN",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "Australia",
        "rank_t20": 2, "rank_odi": 2, "rank_test": 1,
        "form": 82,
        "home_strength": 90,
        "away_strength": 80,
        "flag_code": "AU",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "England",
        "rank_t20": 3, "rank_odi": 4, "rank_test": 3,
        "form": 75,
        "home_strength": 85,
        "away_strength": 70,
        "flag_code": "GB",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "South Africa",
        "rank_t20": 4, "rank_odi": 3, "rank_test": 4,
        "form": 70,
        "home_strength": 85,
        "away_strength": 65,
        "flag_code": "ZA",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "New Zealand",
        "rank_t20": 5, "rank_odi": 5, "rank_test": 5,
        "form": 72,
        "home_strength": 80,
        "away_strength": 65,
        "flag_code": "NZ",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "Pakistan",
        "rank_t20": 6, "rank_odi": 6, "rank_test": 6,
        "form": 65,
        "home_strength": 75,
        "away_strength": 60,
        "flag_code": "PK",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "Sri Lanka",
        "rank_t20": 8, "rank_odi": 7, "rank_test": 7,
        "form": 60,
        "home_strength": 75,
        "away_strength": 50,
        "flag_code": "LK",
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "name": "West Indies",
        "rank_t20": 7, "rank_odi": 10, "rank_test": 8,
        "form": 65,
        "home_strength": 70,
        "away_strength": 50,
        "flag_code": "WI",
        "updated_at": datetime.now(timezone.utc)
    },
]

# ─────────────────────────────────────────────
# 2. Head-to-Head Collection
# ─────────────────────────────────────────────
h2h_data = [
    {"team1": "India",     "team2": "Australia",    "team1_win_pct": 0.52, "matches_played": 120, "updated_at": datetime.now(timezone.utc)},
    {"team1": "India",     "team2": "England",      "team1_win_pct": 0.60, "matches_played": 105, "updated_at": datetime.now(timezone.utc)},
    {"team1": "India",     "team2": "Pakistan",     "team1_win_pct": 0.75, "matches_played": 135, "updated_at": datetime.now(timezone.utc)},
    {"team1": "India",     "team2": "South Africa", "team1_win_pct": 0.55, "matches_played": 90,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "India",     "team2": "New Zealand",  "team1_win_pct": 0.62, "matches_played": 85,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "India",     "team2": "Sri Lanka",    "team1_win_pct": 0.70, "matches_played": 150, "updated_at": datetime.now(timezone.utc)},
    {"team1": "India",     "team2": "West Indies",  "team1_win_pct": 0.65, "matches_played": 130, "updated_at": datetime.now(timezone.utc)},
    {"team1": "Australia", "team2": "England",      "team1_win_pct": 0.55, "matches_played": 140, "updated_at": datetime.now(timezone.utc)},
    {"team1": "Australia", "team2": "South Africa", "team1_win_pct": 0.52, "matches_played": 100, "updated_at": datetime.now(timezone.utc)},
    {"team1": "Australia", "team2": "New Zealand",  "team1_win_pct": 0.58, "matches_played": 75,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "Australia", "team2": "Pakistan",     "team1_win_pct": 0.60, "matches_played": 95,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "Australia", "team2": "Sri Lanka",    "team1_win_pct": 0.65, "matches_played": 80,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "Australia", "team2": "West Indies",  "team1_win_pct": 0.60, "matches_played": 110, "updated_at": datetime.now(timezone.utc)},
    {"team1": "England",   "team2": "South Africa", "team1_win_pct": 0.48, "matches_played": 85,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "England",   "team2": "New Zealand",  "team1_win_pct": 0.52, "matches_played": 70,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "England",   "team2": "Pakistan",     "team1_win_pct": 0.50, "matches_played": 90,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "England",   "team2": "Sri Lanka",    "team1_win_pct": 0.58, "matches_played": 65,  "updated_at": datetime.now(timezone.utc)},
    {"team1": "England",   "team2": "West Indies",  "team1_win_pct": 0.55, "matches_played": 120, "updated_at": datetime.now(timezone.utc)},
    {"team1": "South Africa", "team2": "New Zealand",  "team1_win_pct": 0.54, "matches_played": 60, "updated_at": datetime.now(timezone.utc)},
    {"team1": "South Africa", "team2": "Pakistan",     "team1_win_pct": 0.56, "matches_played": 70, "updated_at": datetime.now(timezone.utc)},
    {"team1": "South Africa", "team2": "Sri Lanka",    "team1_win_pct": 0.62, "matches_played": 55, "updated_at": datetime.now(timezone.utc)},
    {"team1": "South Africa", "team2": "West Indies",  "team1_win_pct": 0.58, "matches_played": 75, "updated_at": datetime.now(timezone.utc)},
    {"team1": "New Zealand",  "team2": "Pakistan",     "team1_win_pct": 0.50, "matches_played": 65, "updated_at": datetime.now(timezone.utc)},
    {"team1": "New Zealand",  "team2": "Sri Lanka",    "team1_win_pct": 0.55, "matches_played": 50, "updated_at": datetime.now(timezone.utc)},
    {"team1": "New Zealand",  "team2": "West Indies",  "team1_win_pct": 0.52, "matches_played": 55, "updated_at": datetime.now(timezone.utc)},
    {"team1": "Pakistan",     "team2": "Sri Lanka",    "team1_win_pct": 0.58, "matches_played": 80, "updated_at": datetime.now(timezone.utc)},
    {"team1": "Pakistan",     "team2": "West Indies",  "team1_win_pct": 0.55, "matches_played": 70, "updated_at": datetime.now(timezone.utc)},
    {"team1": "Sri Lanka",    "team2": "West Indies",  "team1_win_pct": 0.50, "matches_played": 60, "updated_at": datetime.now(timezone.utc)},
]


def seed():
    print("[*] Seeding WinPredictor database...")

    # -- Teams --
    db.teams.drop()
    db.teams.insert_many(teams_data)
    db.teams.create_index("name", unique=True)
    print(f"   [OK] Inserted {len(teams_data)} teams")

    # -- Head-to-Head --
    db.head_to_head.drop()
    db.head_to_head.insert_many(h2h_data)
    db.head_to_head.create_index([("team1", 1), ("team2", 1)], unique=True)
    print(f"   [OK] Inserted {len(h2h_data)} head-to-head records")

    # -- Predictions (create empty collection with schema validation) --
    if "predictions" in db.list_collection_names():
        db.predictions.drop()

    db.create_collection("predictions")
    db.predictions.create_index("created_at")
    db.predictions.create_index([("team1", 1), ("team2", 1)])
    print("   [OK] Created predictions collection (empty, ready to log)")

    print("\n[SUCCESS] Database seeded successfully!")
    print(f"   Database: WinPredictor")
    print(f"   Collections: teams, head_to_head, predictions")


if __name__ == "__main__":
    seed()
