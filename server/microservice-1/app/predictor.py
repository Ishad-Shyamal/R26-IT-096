import joblib
import os
import numpy as np
from dotenv import load_dotenv


load_dotenv()
MODEL_PATH = os.getenv("MODEL_PATH", "app/models/ipl_model.pkl")

def predict_ipl_probability(performance_score, marker_score, geopolitical_risk=0):
    

    try:

        if not os.path.exists(MODEL_PATH):
            return 0.0  

        model = joblib.load(MODEL_PATH)


        # Features: [performance_score, marker_score, geopolitical_risk]
        input_data = np.array([[performance_score, marker_score, geopolitical_risk]])

        
        probability = model.predict_proba(input_data)[0][1]


        return float(probability * 100)

    except Exception as e:
        print(f"Prediction Error: {e}")
        return 0.0


if __name__ == "__main__":
    
    res = predict_ipl_probability(9.5, 5, 0)
    print(f"IPL Selection Probability: {res:.2f}%")