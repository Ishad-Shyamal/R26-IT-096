import re
from app.utils.constants import GEOPOLITICAL_KEYWORDS, COUNTRY_RISKS

def detect_geopolitical_signals(news_text):
    
    if not news_text:
        return {
            "geopolitical_risk_score": 0,
            "risk_level": "Low",
            "binary_risk_signal": 0,
            "detected_issues": []
        }

    text = news_text.lower()
    
    risk_score = 0
    detected_issues = []
    
    for country, weight in COUNTRY_RISKS.items():
        if re.search(rf'\b{country}\b', text):
            for keyword in GEOPOLITICAL_KEYWORDS:
                if re.search(rf'\b{keyword}\b', text):
                    risk_score += weight
                    detected_issues.append(f"{country.title()}: {keyword.title()}")

    risk_level = "Low"
    binary_risk = 0 

    if risk_score >= 1.0:
        risk_level = "High"
        binary_risk = 1
    elif risk_score > 0:
        risk_level = "Medium"
        binary_risk = 1 

    return {
        "geopolitical_risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "binary_risk_signal": binary_risk,
        "detected_issues": list(set(detected_issues)) 
    }

if __name__ == "__main__":
    sample_news = "Reports indicate visa issues for players from Pakistan due to rising security concerns."
    print(detect_geopolitical_signals(sample_news))