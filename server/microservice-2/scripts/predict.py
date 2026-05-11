import sys
import json
import pandas as pd
import joblib
import os

def get_real_prediction(country, category, player_name):
    try:
        # 1. LOAD PRE-TRAINED MODEL
        model_path = 'models/performance_model.pkl'
        if not os.path.exists(model_path):
            return json.dumps({"status": "error", "message": "Model not trained. Run train_model.py first."})
        
        model = joblib.load(model_path)
        
        # 2. FETCH PROCESSED PLAYER FEATURES
        stats_path = 'data/processed_features.csv'
        if not os.path.exists(stats_path):
            return json.dumps({"status": "error", "message": "Data not processed. Run data_processor.py first."})
            
        stats = pd.read_csv(stats_path)
        
        # Filtering for the specific player
        player_data = stats[stats['player_name'] == player_name].copy()

        if player_data.empty:
            return json.dumps({
                "status": "error", 
                "message": f"No historical data found for {player_name}."
            })

        # IMPROVED DATA SELECTION:
        # We want the most representative record. 
        # Usually, this is the yearly aggregate (e.g., '2026') or the most recent match.
        # We sort by match_id to get the latest year/date.
        player_data = player_data.sort_values(by='match_id', ascending=True)
        
        # We prefer records with non-zero batting stats if available
        representative_data = player_data[player_data['balls_faced'] > 0]
        if not representative_data.empty:
            latest_data = representative_data.iloc[-1]
        else:
            latest_data = player_data.iloc[-1]

        # Ensure form_index is numeric for XGBoost
        current_form_val = pd.to_numeric(latest_data['form_index'], errors='coerce')
        current_form = pd.DataFrame([[current_form_val]], columns=['form_index'])

        # Make a prediction
        prediction = model.predict(current_form)[0]

        # 3. CONSTRUCT ADVANCED METRICS
        metrics = {
            "powerPlayImpact": round(float(latest_data['power_play_impact']), 2),
            "matchWinningImpact": round(float(latest_data['match_winning_impact']), 2),
            "deathOversEfficiency": round(float(latest_data['death_overs_efficiency']), 2),
            "pressureHandling": round(float(latest_data['pressure_handling']), 2),
            "boundaryConsistency": round(float(latest_data['boundary_consistency']), 2),
            "confidenceInterval": round(float(latest_data['confidence_interval']), 2)
        }

        # 4. DYNAMIC SKILL HEATMAP DATA
        heatmap_data = {
            "powerplay": metrics["powerPlayImpact"],
            "death_overs": metrics["deathOversEfficiency"],
            "consistency": metrics["boundaryConsistency"],
            "clutch": metrics["pressureHandling"],
            "volume": round(min(float(latest_data['runs']) / 5, 100), 2)
        }

        # 5. CONSTRUCT JSON RESPONSE
        result = {
            "playerName": player_name,
            "predictedScore": round(float(prediction), 2),
            "formIndex": round(float(latest_data['form_index']), 2),
            "category": category,
            "metrics": metrics,
            "heatmap": heatmap_data,
            "status": "success"
        }
        return json.dumps(result)

    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})

if __name__ == "__main__":
    if len(sys.argv) > 3:
        input_country = sys.argv[1]
        input_category = sys.argv[2]
        input_name = sys.argv[3]
        print(get_real_prediction(input_country, input_category, input_name))
    else:
        print(json.dumps({"status": "error", "message": "Insufficient arguments"}))