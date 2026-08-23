import joblib
import os
import pandas as pd  
import numpy as np
from dotenv import load_dotenv

load_dotenv()

# ─── 📂 DYNAMIC & ABSOLUTE PATH SETUP ───
# මෙම script එක ඇති තැන අනුව project root folder එක සොයා ගැනීම.
# predict.py එක තියෙන්නේ app/ folder එක ඇතුළේ නම්:
# ─── 📂 DYNAMIC & ABSOLUTE PATH SETUP ───
# predict.py පවතින්නේ app/ folder එක ඇතුළේ බැවින්:
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__)) # මෙය /app/ වේ.

# file එක පවතින්නේ app/training/app/models/ipl_model.pkl හි බැවින්:
DEFAULT_PATH = os.path.join(CURRENT_DIR, "training", "app", "models", "ipl_model.pkl")

# .env එකේ path එකක් නැත්නම් auto හැදෙන නිවැරදි absolute path එක ගන්නවා
MODEL_PATH = os.getenv("MODEL_PATH", DEFAULT_PATH)

# 🎯 Model එක එකම එක වාරයක් පමණක් Globally load කරගැනීම (Startup)
model = None
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"🎯 [SUCCESS] IPL Model loaded successfully from: {MODEL_PATH}")
    else:
        # Server එක start වෙද්දී එකම එක වාරයක් පමණක් මෙම warning එක පෙන්වයි
        print(f"⚠️ [WARNING] Model file not found at startup: {MODEL_PATH}")
except Exception as e:
    print(f"❌ [CRITICAL] Failed to load model file at startup: {e}")
    model = None


def predict_ipl_probability(performance_score, marker_score, geopolitical_risk=0):
    """
    ලූප් එකක් ඇතුළත නැවත නැවත file open කිරීම හෝ joblib.load කිරීම සිදු නොකරයි.
    """
    global model
    
    # Model එක load වී නැත්නම් හැම තිස්සෙම error print කරන්නේ නැතිව නිශ්ශබ්දව 0.0 ලබා දේ
    if model is None:
        return 0.0  

    try:
        # Scikit-learn models වලට columns ටික හරියටම දිය යුතුය
        input_data = pd.DataFrame(
            [[performance_score, marker_score, geopolitical_risk]], 
            columns=['performance_score', 'marker_score', 'geopolitical_risk']
        )

        probability = model.predict_proba(input_data)[0][1]
        return float(probability) 

    except Exception as e:
        # prediction එකේදී වෙනත් error එකක් ආවොත් පමණක් බලා ගැනීමට
        print(f"Prediction Error: {e}")
        return 0.0


if __name__ == "__main__":
    # Test කිරීම සඳහා පමණි (Script එක තනිව run කරන විට)
    player_name = "Pathum Nissanka"
    p_score = 9.25
    m_score = 4.10
    g_risk = 0 # 0 = Low, 1 = High

    prob_score = predict_ipl_probability(p_score, m_score, g_risk)
    final_percentage = prob_score * 100

    print("\n" + "╔" + "═"*45 + "╗")
    print("║" + " "*10 + "INSIGHTCRIC AI - IPL PREDICTOR" + " "*5 + "║")
    print("╠" + "═"*45 + "╣")
    print(f"║ PLAYER NAME       : {player_name:<25} ║")
    print(f"║ PERFORMANCE SCORE : {p_score:<25.2f} ║")
    print(f"║ MARKER SCORE      : {m_score:<25.2f} ║")
    print(f"║ GEOPOLITICAL RISK : {'LOW (Safe)':<25}" if g_risk == 0 else f"║ GEOPOLITICAL RISK : {'HIGH (Critical)':<25}")
    print("╠" + "═"*45 + "╣")
    
    print(f"║ SELECTION PROBABILITY : {final_percentage:>10.2f}%        ║")
    
    if final_percentage >= 75:
        decision = "★ HIGH CHANCE OF SELECTION ★"
    elif final_percentage >= 50:
        decision = "✔ POTENTIAL FOR SQUAD"
    else:
        decision = "✘ UNLIKELY TO BE SELECTED"
        
    print("╠" + "═"*45 + "╣")
    print(f"║ DECISION: {decision:^34} ║")
    print("╚" + "═"*45 + "╝\n")