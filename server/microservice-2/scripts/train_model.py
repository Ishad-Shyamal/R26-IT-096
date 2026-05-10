import pandas as pd
from xgboost import XGBRegressor
import joblib 
import os

def train_performance_model():
    # Load the processed data we just created
    if not os.path.exists('data/processed_features.csv'):
        print("Error: 'data/processed_features.csv' not found. Run data_processor.py first.")
        return

    data = pd.read_csv('data/processed_features.csv')

    # Define your Features (X) and Target (y)
    X = data[['form_index']] 
    y = data['runs'] 

    # Initialize and train the XGBoost Regressor
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X, y)

    # Save the trained model to the 'models' folder
    if not os.path.exists('models'):
        os.makedirs('models')
    joblib.dump(model, 'models/performance_model.pkl')
    print("XGBoost model trained and saved to models/performance_model.pkl")

if __name__ == "__main__":
    train_performance_model()