# app/utils/constants.py

# 1. Performance Keywords and Weights (PPI Logic)
# පුවත් ලිපියක ඇති වචන අනුව ක්‍රීඩකයාට ලැබෙන ලකුණු ප්‍රමාණය
PERFORMANCE_KEYWORDS = {
    "century": 5.0,
    "hundred": 5.0,
    "fifty": 2.5,
    "half-century": 2.5,
    "wicket": 1.5,
    "wickets": 1.5,
    "runs": 0.1,
    "hat-trick": 4.0,
    "fifer": 4.0,
    "maiden": 0.5,
    "strike rate": 1.0,
    "sixes": 0.5,
    "boundary": 0.2,
    "stumped": 1.0,
    "catch": 0.5
}

# 2. Selection Markers (Award Recognition)
# විශේෂ ඇගයීම් සඳහා ලබා දෙන ලකුණු
AWARD_KEYWORDS = [
    "man of the match",
    "player of the match",
    "player of the tournament",
    "orange cap",
    "purple cap",
    "emerging player",
    "most valuable player",
    "mvp",
    "record-breaking",
    "consistent performance"
]

# 3. Geopolitical Signal Detection (GSD Logic)
# භූ-දේශපාලනික අවදානම් හඳුනාගැනීමට අවශ්‍ය වචන
GEOPOLITICAL_KEYWORDS = [
    "visa issue",
    "visa delay",
    "security concern",
    "political tension",
    "diplomatic",
    "ban",
    "protest",
    "conflict",
    "government restriction",
    "no-objection certificate",
    "noc"
]

# 4. Country-Specific Risk Weights
# රටවල් අනුව අවදානම් මට්ටම් (මෙය පර්යේෂණ පත්‍රිකා පදනම් කරගෙන සකස් කළ හැක)
COUNTRY_RISKS = {
    "pakistan": 1.0,
    "afghanistan": 0.7,
    "sri lanka": 0.2,
    "bangladesh": 0.3,
    "south africa": 0.1
}

# 5. General Config
DEFAULT_MARKER_SCORE = 0
MAX_PERFORMANCE_SCORE = 10.0
MAX_MARKER_SCORE = 5.0