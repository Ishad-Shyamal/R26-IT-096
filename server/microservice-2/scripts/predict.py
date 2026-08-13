import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

EXPECTED_FEATURES = [
    'form_index', 
    'strike_rate', 
    'power_play_impact', 
    'death_overs_efficiency', 
    'boundary_consistency', 
    'type_ALL', 
    'type_ODI', 
    'type_T20', 
    'type_TEST'
]

def load_resources():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.abspath(os.path.join(base_dir, '..'))
    
    model_path = os.path.join(parent_dir, 'models', 'performance_model.pkl')
    data_path = os.path.join(parent_dir, 'data', 'processed_features.csv')

    if not os.path.exists(model_path):
        model_path = os.path.join(base_dir, 'models', 'performance_model.pkl')
    if not os.path.exists(data_path):
        data_path = os.path.join(base_dir, 'data', 'processed_features.csv')

    model = joblib.load(model_path)
    df = pd.read_csv(data_path)
    return model, df

def safe_scale(value, min_val, max_val):
    if pd.isna(value) or value is None:
        return 0.0
    if max_val == min_val or max_val <= 0:
        return 50.0
    scaled = ((float(value) - min_val) / (max_val - min_val)) * 100
    return round(min(max(scaled, 0.0), 100.0), 2)

def predict_player_performance(player_name, country, category):
    try:
        model, df = load_resources()

        batsman_col = 'batsman' if 'batsman' in df.columns else 'player_name'
        df['clean_batsman'] = df[batsman_col].astype(str).str.strip().str.lower()
        search_name = str(player_name).strip().lower()

        player_df = df[df['clean_batsman'] == search_name]

        if 'category' in df.columns and category:
            cat_filtered = player_df[player_df['category'].astype(str).str.lower() == str(category).lower()]
            if not cat_filtered.empty:
                player_df = cat_filtered

        if player_df.empty:
            player_row = df.mean(numeric_only=True).to_dict()
            is_fallback = True
        else:
            player_row = player_df.iloc[-1].to_dict()
            is_fallback = False

        form_index = float(player_row.get('form_index', 50.0))
        strike_rate = float(player_row.get('strike_rate', 120.0))
        power_play_impact = float(player_row.get('power_play_impact', 60.0))
        death_overs_efficiency = float(player_row.get('death_overs_efficiency', 55.0))
        boundary_consistency = float(player_row.get('boundary_consistency', 50.0))

        cat_str = str(category).upper() if category else 'T20'
        type_ALL = 1.0 if cat_str == 'ALL' else 0.0
        type_ODI = 1.0 if cat_str == 'ODI' else 0.0
        type_T20 = 1.0 if cat_str in ['T20', 'T20I'] else 0.0
        type_TEST = 1.0 if cat_str == 'TEST' else 0.0

        input_dict = {
            'form_index': [form_index],
            'strike_rate': [strike_rate],
            'power_play_impact': [power_play_impact],
            'death_overs_efficiency': [death_overs_efficiency],
            'boundary_consistency': [boundary_consistency],
            'type_ALL': [type_ALL],
            'type_ODI': [type_ODI],
            'type_T20': [type_T20],
            'type_TEST': [type_TEST]
        }

        input_df = pd.DataFrame(input_dict)[EXPECTED_FEATURES]

        # 4. Prediction Execution
        predicted_runs = float(model.predict(input_df)[0])
        predicted_runs = round(max(0.0, predicted_runs), 1)

        # 5. Form Index & Metrics Normalization (0-100 Range)
        max_form = float(df['form_index'].max() if 'form_index' in df.columns else 1000.0)
        min_form = float(df['form_index'].min() if 'form_index' in df.columns else 0.0)
        scaled_form_index = safe_scale(form_index, min_form, max_form)

        metrics = {
            "powerPlayImpact": safe_scale(power_play_impact, 0, 100) if not is_fallback else 65.0,
            "matchWinningImpact": safe_scale(float(player_row.get('average', 25.0)), 10, 60) if not is_fallback else 58.0,
            "deathOversEfficiency": safe_scale(death_overs_efficiency, 0, 100) if not is_fallback else 70.0,
            "pressureHandling": safe_scale(scaled_form_index, 0, 100) if not is_fallback else 60.0,
            "boundaryConsistency": safe_scale(boundary_consistency, 0, 100) if not is_fallback else 55.0,
            "confidenceInterval": 0.88 if not is_fallback else 0.70
        }

        heatmap = {
            "powerplay": metrics["powerPlayImpact"],
            "middle_overs": round((metrics["powerPlayImpact"] + metrics["matchWinningImpact"]) / 2, 2),
            "death_overs": metrics["deathOversEfficiency"],
            "off_side": metrics["boundaryConsistency"],
            "leg_side": metrics["pressureHandling"],
            "straight": round((metrics["powerPlayImpact"] + metrics["boundaryConsistency"]) / 2, 2),
            "pace_bowling": metrics["powerPlayImpact"],
            "spin_bowling": metrics["matchWinningImpact"],
            "clutch_rate": metrics["pressureHandling"]
        }

        return {
            "status": "success",
            "playerName": player_name,
            "country": country,
            "category": category,
            "predictedScore": predicted_runs,
            "formIndex": scaled_form_index,
            "metrics": metrics,
            "heatmap": heatmap
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) > 3:
        p_name = sys.argv[1]
        c_country = sys.argv[2]
        m_category = sys.argv[3]
        result = predict_player_performance(p_name, c_country, m_category)
        print(json.dumps(result))
    else:
        test_res = predict_player_performance("Abhishek Sharma", "India", "T20I")
        print(json.dumps(test_res, indent=2))