import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'processed_features.csv')
MODEL_DIR = os.path.join(BASE_DIR, '..', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'performance_model.pkl')

def train_performance_model():
    if not os.path.exists(DATA_PATH):
        print(f"❌ Dataset not found at {DATA_PATH}")
        return

    data = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset with shape: {data.shape}")

    type_col = 'category' if 'category' in data.columns else ('match_type' if 'match_type' in data.columns else None)
    if type_col:
        data = pd.get_dummies(data, columns=[type_col], prefix='type', dtype=float)

    expected_features = [
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

    for col in expected_features:
        if col not in data.columns:
            data[col] = 0.0

    X = data[expected_features].fillna(0.0)
    y = data['runs'] if 'runs' in data.columns else data.get('average', pd.Series([25.0]*len(data)))

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42) if len(data) > 10 else (X, X, y, y)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"✅ Model trained successfully with features: {expected_features}")
    print(f"✅ Model saved at: {MODEL_PATH}")

if __name__ == "__main__":
    train_performance_model()