import os
import glob
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, '..', 'data')
OUTPUT_FILE = os.path.join(DATA_DIR, 'processed_features.csv')

def clean_player_name(name):
    if pd.isna(name):
        return ""
    return str(name).split('(')[0].strip()

def process_all_files():
    batting_files = glob.glob(os.path.join(DATA_DIR, "*batting performance*.csv"))
    
    if not batting_files:
        print("❌ Batting CSV files හමු නොවුණි. කරුණාකර data/ folder එක පරීක්ෂා කරන්න.")
        return

    combined_df_list = []

    for file_path in batting_files:
        filename = os.path.basename(file_path)
        print(f"Processing: {filename}")
        
        try:
            df = pd.read_csv(file_path, header=None)
            
            if df.shape[1] >= 10:
                df.columns = ['batsman', 'span', 'matches', 'inns', 'no', 'runs', 'hs', 'avg', 'bf', 'sr', '100s', '50s', '0s', '4s', '6s'][:df.shape[1]]
                
                if 'T20' in filename:
                    df['category'] = 'T20'
                elif 'Test' in filename:
                    df['category'] = 'TEST'
                elif 'ODI' in filename:
                    df['category'] = 'ODI'
                else:
                    df['category'] = 'ALL'

                combined_df_list.append(df)
        except Exception as e:
            print(f"Error reading {filename}: {e}")

    if not combined_df_list:
        print("❌ Data extract කරගැනීමට නොහැකි විය.")
        return

    full_df = pd.concat(combined_df_list, ignore_index=True)

    full_df = full_df[pd.to_numeric(full_df['runs'], errors='coerce').notnull()]

    full_df['batsman'] = full_df['batsman'].apply(clean_player_name)

    full_df['runs'] = full_df['runs'].astype(float)
    full_df['sr'] = pd.to_numeric(full_df['sr'], errors='coerce').fillna(100.0)
    full_df['avg'] = pd.to_numeric(full_df['avg'], errors='coerce').fillna(20.0)
    
    if '4s' in full_df.columns and '6s' in full_df.columns:
        full_df['boundary_pct'] = ((full_df['4s'].fillna(0).astype(float) * 4 + full_df['6s'].fillna(0).astype(float) * 6) / full_df['runs'].replace(0, 1)) * 100
    else:
        full_df['boundary_pct'] = 15.0

    full_df['strike_rate'] = full_df['sr']
    full_df['average'] = full_df['avg']
    full_df['form_index'] = (full_df['average'] * 0.6) + (full_df['strike_rate'] * 0.4)
    full_df['power_play_impact'] = np.clip(full_df['strike_rate'] * 0.55, 0, 100)
    full_df['death_overs_efficiency'] = np.clip(full_df['strike_rate'] * 0.65, 0, 100)
    full_df['boundary_consistency'] = np.clip(full_df['boundary_pct'] * 2.5, 0, 100)

    final_cols = [
        'batsman', 'category', 'runs', 'form_index', 'strike_rate', 'average',
        'power_play_impact', 'death_overs_efficiency', 'boundary_consistency'
    ]
    
    processed_df = full_df[final_cols].drop_duplicates(subset=['batsman', 'category'])
    processed_df.to_csv(OUTPUT_FILE, index=False)
    print(f"✅ සාර්ථකයි! processed_features.csv සාදන ලදී. (Total Players: {len(processed_df)})")

if __name__ == "__main__":
    process_all_files()