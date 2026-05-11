import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def train_insight_cric_model():
    dataset_path = 'dataset.csv'
    
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found!")
        return

    df = pd.read_csv(dataset_path)

    # X = Input (Features), y = Output (Target)
    X = df[['performance_score', 'marker_score', 'geopolitical_risk']]
    y = df['was_selected']

    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


    model = RandomForestClassifier(
    n_estimators=100, 
    max_depth=5,           
    min_samples_split=10,  
    random_state=42
)
    model.fit(X_train, y_train)

    
    
    train_acc = model.score(X_train, y_train)
    
    
    y_pred = model.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)

    print("\n" + "="*40)
    print("      INSIGHTCRIC MODEL RESULTS")
    print("="*40)
    
    
    print(f"✅ Training Accuracy : {train_acc * 100:.2f}%")
    print(f"🎯 Testing Accuracy  : {test_acc * 100:.2f}%")
    
    print("-" * 40)
    print("Classification Report (Testing Data):")
    print(classification_report(y_test, y_pred))

    
    model_dir = 'app/models'
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    save_path = os.path.join(model_dir, 'ipl_model.pkl')
    joblib.dump(model, save_path)
    print(f"\n✅ Model saved successfully at: {save_path}")

if __name__ == "__main__":
    train_insight_cric_model()