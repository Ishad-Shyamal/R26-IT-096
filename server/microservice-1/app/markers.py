import re
from app.utils.constants import AWARD_KEYWORDS

def extract_selection_markers(text):
   
    text = text.lower()
    marker_score = 0
    detected_markers = []

    # AWARD_KEYWORDS: ["man of the match", "player of the tournament", "orange cap", etc.]
    for award in AWARD_KEYWORDS:

        if re.search(rf'\b{award}\b', text):
            marker_score += 2  
            detected_markers.append(award)


    leadership_keywords = ["captain", "skipper", "vice-captain", "leading run-scorer"]
    for role in leadership_keywords:
        if re.search(rf'\b{role}\b', text):
            marker_score += 1
            detected_markers.append(role)


    buzz_keywords = ["base price", "bidding war", "highly anticipated", "scouted"]
    for buzz in buzz_keywords:
        if re.search(rf'\b{buzz}\b', text):
            marker_score += 1
            detected_markers.append(buzz)

    return {
        "marker_score": min(marker_score, 5), 
        "markers_found": list(set(detected_markers)) 
    }