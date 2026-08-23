"""
X-Factor Players Module
-----------------------
Identifies the highest-ranked Batter, Bowler, and All-Rounder from each
team's predicted Playing XI using ICC player rankings (sourced from Cricinfo).

Supports Test, ODI, and T20I formats.
Falls back to a comprehensive built-in dataset when live scraping fails.
"""

import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import re

router = APIRouter(prefix="/xfactor", tags=["X-Factor Players"])

# =============================================================================
# Request / Response Models
# =============================================================================
class XFactorRequest(BaseModel):
    team1: str
    team2: str
    format: str  # "t20", "odi", "test"
    team1_xi: List[str]
    team2_xi: List[str]

class PlayerCard(BaseModel):
    name: str
    role: str          # "Batter", "Bowler", "All-Rounder"
    rank: int
    rating: int
    country: str

class TeamXFactor(BaseModel):
    team: str
    players: List[PlayerCard]

class XFactorResponse(BaseModel):
    team1_xfactor: TeamXFactor
    team2_xfactor: TeamXFactor
    format: str
    source: str        # "live" or "cached"
    updated_at: str

# =============================================================================
# Comprehensive ICC Rankings Data (July 2026 snapshot from Cricinfo / ICC)
# Each entry: (rank, player_name, country, rating)
# =============================================================================
RANKINGS_CACHE = {
    "t20": {
        "batting": [
            (1, "Ishan Kishan", "India", 876),
            (2, "Abhishek Sharma", "India", 869),
            (3, "Sahibzada Farhan", "Pakistan", 848),
            (4, "Phil Salt", "England", 792),
            (5, "Pathum Nissanka", "Sri Lanka", 751),
            (6, "Tilak Varma", "India", 747),
            (7, "Jos Buttler", "England", 716),
            (8, "Suryakumar Yadav", "India", 708),
            (9, "Mitchell Marsh", "Australia", 706),
            (10, "Dewald Brevis", "South Africa", 702),
            (11, "Brian Bennett", "Zimbabwe", 701),
            (12, "Tim Seifert", "New Zealand", 698),
            (13, "Travis Head", "Australia", 679),
            (14, "Ibrahim Zadran", "Afghanistan", 678),
            (15, "Shai Hope", "West Indies", 668),
            (15, "Jacob Bethell", "England", 668),
            (17, "Rahmanullah Gurbaz", "Afghanistan", 662),
            (18, "Kamil Mishara", "Sri Lanka", 657),
            (19, "Ryan Rickelton", "South Africa", 641),
            (20, "Harry Brook", "England", 640),
        ],
        "bowling": [
            (1, "Rashid Khan", "Afghanistan", 753),
            (2, "Abrar Ahmed", "Pakistan", 736),
            (3, "Varun Chakaravarthy", "India", 725),
            (4, "Adil Rashid", "England", 721),
            (5, "Adam Zampa", "Australia", 700),
            (6, "Jasprit Bumrah", "India", 688),
            (7, "Nathan Ellis", "Australia", 675),
            (8, "Corbin Bosch", "South Africa", 669),
            (9, "Wanindu Hasaranga", "Sri Lanka", 668),
            (10, "Mujeeb Ur Rahman", "Afghanistan", 663),
            (11, "Nasum Ahmed", "Bangladesh", 660),
            (12, "Mohammad Nawaz", "Pakistan", 658),
            (12, "Maheesh Theekshana", "Sri Lanka", 658),
            (14, "Brad Evans", "Zimbabwe", 651),
            (15, "Mustafizur Rahman", "Bangladesh", 649),
            (15, "Arshdeep Singh", "India", 649),
            (17, "Matthew Forde", "West Indies", 646),
            (18, "Dunith Wellalage", "Sri Lanka", 640),
            (19, "Axar Patel", "India", 637),
            (20, "Trent Boult", "New Zealand", 630),
        ],
        "allrounder": [
            (1, "Sikandar Raza", "Zimbabwe", 328),
            (2, "Hardik Pandya", "India", 287),
            (3, "Saim Ayub", "Pakistan", 275),
            (4, "Dipendra Singh Airee", "Nepal", 256),
            (5, "Roston Chase", "West Indies", 249),
            (6, "Azmatullah Omarzai", "Afghanistan", 241),
            (7, "Shivam Dube", "India", 220),
            (8, "Mohammad Nabi", "Afghanistan", 209),
            (8, "Jason Holder", "West Indies", 209),
            (10, "Mohammad Nawaz", "Pakistan", 203),
            (11, "Mitchell Santner", "New Zealand", 195),
            (12, "Gerhard Erasmus", "Namibia", 188),
            (13, "Will Jacks", "England", 186),
            (14, "Rashid Khan", "Afghanistan", 183),
            (15, "Romario Shepherd", "West Indies", 181),
            (17, "Wanindu Hasaranga", "Sri Lanka", 167),
            (18, "Dasun Shanaka", "Sri Lanka", 166),
            (19, "Marcus Stoinis", "Australia", 165),
            (19, "Sam Curran", "England", 165),
            (21, "Glenn Maxwell", "Australia", 160),
        ],
    },
    "odi": {
        "batting": [
            (1, "Daryl Mitchell", "New Zealand", 815),
            (2, "Shubman Gill", "India", 791),
            (3, "Virat Kohli", "India", 768),
            (4, "Rohit Sharma", "India", 754),
            (5, "Ibrahim Zadran", "Afghanistan", 712),
            (6, "Babar Azam", "Pakistan", 689),
            (7, "Shai Hope", "West Indies", 683),
            (8, "Harry Tector", "Ireland", 679),
            (9, "Charith Asalanka", "Sri Lanka", 659),
            (10, "Harry Brook", "England", 656),
            (11, "KL Rahul", "India", 651),
            (12, "Kusal Mendis", "Sri Lanka", 648),
            (13, "Quinton de Kock", "South Africa", 640),
            (14, "Shreyas Iyer", "India", 638),
            (15, "Rahmanullah Gurbaz", "Afghanistan", 632),
            (15, "Pathum Nissanka", "Sri Lanka", 632),
            (17, "Salman Agha", "Pakistan", 630),
            (18, "Joe Root", "England", 626),
            (19, "Travis Head", "Australia", 610),
            (20, "Towhid Hridoy", "Bangladesh", 609),
        ],
        "bowling": [
            (1, "Rashid Khan", "Afghanistan", 682),
            (2, "Abrar Ahmed", "Pakistan", 675),
            (3, "Jofra Archer", "England", 649),
            (4, "Keshav Maharaj", "South Africa", 645),
            (5, "Maheesh Theekshana", "Sri Lanka", 641),
            (6, "Adil Rashid", "England", 629),
            (7, "Kuldeep Yadav", "India", 614),
            (8, "Mehidy Hasan Miraz", "Bangladesh", 604),
            (8, "Shaheen Afridi", "Pakistan", 604),
            (10, "Mitchell Santner", "New Zealand", 599),
            (11, "Bernard Scholtz", "Namibia", 595),
            (12, "Josh Hazlewood", "Australia", 589),
            (13, "Wanindu Hasaranga", "Sri Lanka", 588),
            (14, "Matt Henry", "New Zealand", 582),
            (15, "Jayden Seales", "West Indies", 570),
            (16, "Adam Zampa", "Australia", 569),
            (17, "Mohammed Siraj", "India", 568),
            (18, "Shoriful Islam", "Bangladesh", 561),
            (19, "Haris Rauf", "Pakistan", 556),
            (20, "Jasprit Bumrah", "India", 550),
        ],
        "allrounder": [
            (1, "Azmatullah Omarzai", "Afghanistan", 316),
            (2, "Sikandar Raza", "Zimbabwe", 276),
            (3, "Mehidy Hasan Miraz", "Bangladesh", 262),
            (4, "Mohammad Nabi", "Afghanistan", 258),
            (5, "Michael Bracewell", "New Zealand", 230),
            (6, "Brandon McMullen", "Scotland", 228),
            (7, "Mitchell Santner", "New Zealand", 225),
            (8, "Rashid Khan", "Afghanistan", 220),
            (9, "Wanindu Hasaranga", "Sri Lanka", 205),
            (10, "Salman Agha", "Pakistan", 193),
            (12, "Axar Patel", "India", 189),
            (12, "Charith Asalanka", "Sri Lanka", 189),
            (14, "Adil Rashid", "England", 186),
            (15, "Ravindra Jadeja", "India", 178),
            (15, "Marco Jansen", "South Africa", 178),
            (17, "Gudakesh Motie", "West Indies", 177),
            (18, "Roston Chase", "West Indies", 176),
            (19, "Josh Hazlewood", "Australia", 174),
            (20, "Hardik Pandya", "India", 170),
            (21, "Glenn Maxwell", "Australia", 165),
        ],
    },
    "test": {
        "batting": [
            (1, "Travis Head", "Australia", 853),
            (2, "Harry Brook", "England", 852),
            (3, "Joe Root", "England", 840),
            (4, "Steve Smith", "Australia", 831),
            (5, "Temba Bavuma", "South Africa", 775),
            (6, "Shubman Gill", "India", 743),
            (7, "Rachin Ravindra", "New Zealand", 740),
            (8, "Kamindu Mendis", "Sri Lanka", 737),
            (9, "Yashasvi Jaiswal", "India", 733),
            (10, "Dinesh Chandimal", "Sri Lanka", 725),
            (11, "Kane Williamson", "New Zealand", 720),
            (12, "Marnus Labuschagne", "Australia", 715),
            (13, "Daryl Mitchell", "New Zealand", 708),
            (14, "Virat Kohli", "India", 700),
            (15, "Ben Duckett", "England", 695),
            (16, "Usman Khawaja", "Australia", 688),
            (17, "KL Rahul", "India", 680),
            (18, "Babar Azam", "Pakistan", 675),
            (19, "Saud Shakeel", "Pakistan", 668),
            (20, "Devon Conway", "New Zealand", 660),
        ],
        "bowling": [
            (1, "Jasprit Bumrah", "India", 870),
            (2, "Matt Henry", "New Zealand", 861),
            (3, "Mitchell Starc", "Australia", 838),
            (4, "Pat Cummins", "Australia", 832),
            (5, "Marco Jansen", "South Africa", 825),
            (6, "Scott Boland", "Australia", 820),
            (7, "Noman Ali", "Pakistan", 817),
            (8, "Kagiso Rabada", "South Africa", 807),
            (9, "Josh Hazlewood", "Australia", 775),
            (10, "Nathan Lyon", "Australia", 753),
            (11, "Taijul Islam", "Bangladesh", 738),
            (12, "Gus Atkinson", "England", 729),
            (13, "Simon Harmer", "South Africa", 721),
            (14, "Kuldeep Yadav", "India", 695),
            (14, "Mohammed Siraj", "India", 695),
            (14, "Shamar Joseph", "West Indies", 695),
            (17, "Kemar Roach", "West Indies", 692),
            (18, "Ravindra Jadeja", "India", 691),
            (19, "Blessing Muzarabani", "Zimbabwe", 687),
            (20, "Prabath Jayasuriya", "Sri Lanka", 686),
        ],
        "allrounder": [
            (1, "Ravindra Jadeja", "India", 446),
            (2, "Marco Jansen", "South Africa", 344),
            (3, "Ben Stokes", "England", 289),
            (4, "Mitchell Starc", "Australia", 284),
            (4, "Mehidy Hasan Miraz", "Bangladesh", 284),
            (6, "Pat Cummins", "Australia", 250),
            (7, "Wiaan Mulder", "South Africa", 245),
            (8, "Washington Sundar", "India", 244),
            (9, "Gus Atkinson", "England", 243),
            (10, "Joe Root", "England", 209),
            (11, "Axar Patel", "India", 198),
            (11, "Shamar Joseph", "West Indies", 198),
            (13, "Kagiso Rabada", "South Africa", 197),
            (14, "Kyle Jamieson", "New Zealand", 189),
            (15, "Glenn Phillips", "New Zealand", 188),
            (16, "Mitchell Santner", "New Zealand", 182),
            (17, "Keshav Maharaj", "South Africa", 178),
            (18, "Cameron Green", "Australia", 168),
            (19, "Matt Henry", "New Zealand", 166),
            (20, "Nathan Lyon", "Australia", 164),
        ],
    },
}

# Mapping format values from the frontend to ICC URL slugs
FORMAT_MAP = {"t20": "t20i", "odi": "odi", "test": "test"}

# =============================================================================
# Live Scraper — fetches from ICC website
# =============================================================================
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

from functools import lru_cache

@lru_cache(maxsize=32)
def _scrape_rankings(fmt_slug: str, role: str) -> list:
    """
    Attempt to scrape live ICC rankings.
    role: 'batting', 'bowling', 'allrounder'
    Returns list of (rank, name, country, rating) or empty list on failure.
    """
    url_role = role if role != "allrounder" else "allrounder"
    url = f"https://www.icc-cricket.com/rankings/{url_role}/mens/{fmt_slug}"
    try:
        resp = httpx.get(url, headers=HEADERS, timeout=3, follow_redirects=True)
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
        rows = soup.select("table tbody tr")
        results = []
        for row in rows[:50]:
            cols = row.find_all("td")
            if len(cols) >= 4:
                rank = int(re.sub(r"\D", "", cols[0].get_text(strip=True)) or "999")
                name = cols[1].get_text(strip=True)
                country = cols[2].get_text(strip=True)
                rating = int(re.sub(r"\D", "", cols[3].get_text(strip=True)) or "0")
                results.append((rank, name, country, rating))
        # Filter out entries with empty/blank names (broken HTML parsing)
        valid = [(r, n, c, rt) for r, n, c, rt in results if n.strip()]
        return valid if len(valid) >= 5 else []
    except Exception:
        return []


def _get_rankings(fmt: str, role: str) -> list:
    """Get rankings — try live scrape first, fall back to cache."""
    fmt_slug = FORMAT_MAP.get(fmt, "t20i")
    live = _scrape_rankings(fmt_slug, role)
    if live:
        return live
    return RANKINGS_CACHE.get(fmt, {}).get(role, [])


# =============================================================================
# Name Matching Utility
# =============================================================================
def _normalize(name: str) -> str:
    """Normalize a player name for fuzzy matching."""
    return re.sub(r"[^a-z ]", "", name.lower().strip())


def _name_match(xi_name: str, ranked_name: str) -> bool:
    """
    Flexible name matching:
    - Full match
    - Last-name match
    - Partial substring match
    """
    n1 = _normalize(xi_name)
    n2 = _normalize(ranked_name)
    if n1 == n2:
        return True
    # Last name match
    parts1 = n1.split()
    parts2 = n2.split()
    if parts1 and parts2 and parts1[-1] == parts2[-1] and len(parts1[-1]) > 3:
        return True
    # Substring match (one contains the other)
    if len(n1) > 4 and len(n2) > 4:
        if n1 in n2 or n2 in n1:
            return True
    return False


# =============================================================================
# Core Logic — Find X-Factor Players
# =============================================================================
def find_xfactor(playing_xi: list[str], fmt: str, team_name: str) -> list[PlayerCard]:
    """
    Given a Playing XI list, find the best Batter, Bowler, and All-Rounder
    based on ICC rankings for the given format.

    Tie-breaking:
      1. Lower rank number wins
      2. If same rank, higher rating wins
      3. If still tied, earlier position in Playing XI wins
    """
    results = []

    for role in ["batting", "bowling", "allrounder"]:
        rankings = _get_rankings(fmt, role)
        role_label = {"batting": "Batter", "bowling": "Bowler", "allrounder": "All-Rounder"}[role]

        best = None  # (xi_index, rank, rating, ranked_name)

        for xi_idx, xi_player in enumerate(playing_xi):
            for rank, ranked_name, country, rating in rankings:
                if _name_match(xi_player, ranked_name):
                    candidate = (xi_idx, rank, rating, ranked_name, country)
                    if best is None:
                        best = candidate
                    else:
                        _, b_rank, b_rating, _, _ = best
                        # Lower rank is better; if tied, higher rating; if tied, earlier XI position
                        if (rank < b_rank) or \
                           (rank == b_rank and rating > b_rating) or \
                           (rank == b_rank and rating == b_rating and xi_idx < best[0]):
                            best = candidate
                    break  # Found this player in rankings, move to next XI player

        if best:
            xi_idx, rank, rating, name, country = best
            results.append(PlayerCard(
                name=name, role=role_label,
                rank=rank, rating=rating, country=country
            ))

    return results


# =============================================================================
# API Endpoint
# =============================================================================
@router.post("/", response_model=XFactorResponse)
def get_xfactor_players(req: XFactorRequest):
    """
    Accepts two teams' Playing XIs and the match format.
    Returns the top-ranked Batter, Bowler, and All-Rounder from each team.
    """
    fmt = req.format.lower().replace("t20i", "t20").replace("20", "20")
    if fmt not in ("t20", "odi", "test"):
        raise HTTPException(status_code=400, detail="Format must be 't20', 'odi', or 'test'.")

    if not req.team1_xi or not req.team2_xi:
        raise HTTPException(status_code=400, detail="Both teams must have a Playing XI.")

    t1_xf = find_xfactor(req.team1_xi, fmt, req.team1)
    t2_xf = find_xfactor(req.team2_xi, fmt, req.team2)

    # Determine source
    fmt_slug = FORMAT_MAP.get(fmt, "t20i")
    live_test = _scrape_rankings(fmt_slug, "batting")
    source = "live" if live_test else "cached"

    return XFactorResponse(
        team1_xfactor=TeamXFactor(team=req.team1, players=t1_xf),
        team2_xfactor=TeamXFactor(team=req.team2, players=t2_xf),
        format=fmt.upper(),
        source=source,
        updated_at=datetime.now(timezone.utc).isoformat()
    )
