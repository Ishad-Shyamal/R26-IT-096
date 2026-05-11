import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
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

    # 1. SPLIT DATA INTO TRAINING AND TESTING (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 2. INITIALIZE AND TRAIN THE MODEL ON TRAINING SET
    print("Training XGBoost Regressor...")
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X_train, y_train)

    # 3. EVALUATE ACCURACY (R-Squared)
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)

    train_accuracy = r2_score(y_train, train_pred)
    test_accuracy = r2_score(y_test, test_pred)

    print("\n--- Model Accuracy Report ---")
    print(f"Training Accuracy (R2 Score): {train_accuracy * 100:.2f}%")
    print(f"Testing Accuracy (R2 Score):  {test_accuracy * 100:.2f}%")
    print("-----------------------------\n")

    # 4. SAVE THE FINAL MODEL (trained on full data for production use)
    # Re-fitting on full data ensures the model has seen all information before deployment
    model.fit(X, y)
    
    if not os.path.exists('models'):
        os.makedirs('models')
    joblib.dump(model, 'models/performance_model.pkl')
    print("XGBoost model trained on full dataset and saved to models/performance_model.pkl")

if __name__ == "__main__":
    train_performance_model()