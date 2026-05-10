import pandas as pd
import joblib
import os
from sklearn.metrics import r2_score, mean_absolute_error

def verify_model():
    model_path = 'models/performance_model.pkl'
    data_path = 'data/processed_features.csv'

    # 1. Check if files exist
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        return
    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}")
        return

    # 2. Load model and data
    print("Loading model and data...")
    model = joblib.load(model_path)
    data = pd.read_csv(data_path)

    X = data[['form_index']]
    y = data['runs']

    # 3. Calculate metrics
    print("\n--- Model Performance Metrics ---")
    predictions = model.predict(X)
    r2 = r2_score(y, predictions)
    mae = mean_absolute_error(y, predictions)

    print(f"R-Squared (R2) Score: {r2:.4f}")
    print(f"Mean Absolute Error (MAE): {mae:.4f} runs")
    print(f"Note: R2 closer to 1.0 is better. MAE shows average error in run prediction.")

    # 4. Show sample predictions
    print("\n--- Sample Predictions vs Actual ---")
    samples = data.sample(5).copy()
    samples['predicted_runs'] = model.predict(samples[['form_index']])
    samples['predicted_runs'] = samples['predicted_runs'].round(2)
    
    # Display relevant columns
    display_cols = ['player_name', 'match_id', 'runs', 'form_index', 'predicted_runs']
    print(samples[display_cols].to_string(index=False))

    # 5. Feature Importance
    print("\n--- Feature Importance ---")
    # For XGBoost, we can get feature importance
    importance = model.feature_importances_
    for i, val in enumerate(importance):
        print(f"Feature '{X.columns[i]}': {val:.4f}")

if __name__ == "__main__":
    verify_model()
