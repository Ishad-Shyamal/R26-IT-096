import pandas as pd
import glob
import os
import re

def detect_match_type_from_filename(filename):
    fname = filename.lower()
    if 't20' in fname:
        return 'T20'
    elif 'odi' in fname:
        return 'ODI'
    elif 'test' in fname:
        return 'TEST'
    elif 'ipl' in fname:
        return 'T20'
    return 'ALL'

def process_all_datasets(input_folder):
    all_files = glob.glob(os.path.join(input_folder, "*.csv"))
    if not all_files:
        print(f"Error: No CSV files found in {input_folder}")
        return

    li = []
    print(f"Found {len(all_files)} files. Extracting format metadata and features...")

    for filename in all_files:
        try:
            df = pd.read_csv(filename, index_col=None, header=0)
            
            basename = os.path.basename(filename)
            year_match = re.search(r'20\d{2}', basename)
            fallback_id = year_match.group(0) if year_match else basename
            fallback_type = detect_match_type_from_filename(basename)

            # Standardize column headers
            df.columns = df.columns.str.strip().str.lower()

            column_mapping = {
                'player name': 'player_name', 'player': 'player_name', 'name': 'player_name',
                'match id': 'match_id', 'id': 'match_id', 'scorecard': 'match_id', 'match date': 'match_id',
                'match type': 'match_type', 'format': 'match_type', 'type': 'match_type', 'category': 'match_type',
                'runs scored': 'runs', 'runs': 'runs',
                'batting strike rate': 'strike_rate', 'sr': 'strike_rate',
                'balls faced': 'balls_faced', 'bf': 'balls_faced',
                'boundary fours': 'fours', 'fours': 'fours', '4s': 'fours',
                'boundary sixes': 'sixes', 'sixes': 'sixes', '6s': 'sixes',
                'not outs': 'not_outs', 'no': 'not_outs',
                'batting average': 'avg', 'ave': 'avg'
            }
            df.rename(columns=column_mapping, inplace=True)
            df = df.loc[:, ~df.columns.duplicated()]

            # Standardize Match ID and Match Type fallbacks
            if 'match_id' not in df.columns:
                df['match_id'] = fallback_id
            if 'match_type' not in df.columns:
                df['match_type'] = fallback_type
            else:
                df['match_type'] = df['match_type'].astype(str).str.upper().str.strip()

            numeric_cols = ['runs', 'strike_rate', 'balls_faced', 'fours', 'sixes', 'not_outs', 'avg']
            for col in numeric_cols:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col].astype(str).str.replace('*', '', regex=False), errors='coerce').fillna(0)
                else:
                    df[col] = 0

            required = ['player_name', 'match_id', 'match_type'] + numeric_cols
            available = [col for col in required if col in df.columns]
            
            if 'player_name' not in available:
                continue
                
            li.append(df[available])
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    if not li:
        print("No valid data found.")
        return

    master_df = pd.concat(li, axis=0, ignore_index=True)
    master_df['player_name'] = master_df['player_name'].str.replace(r'\s*\([^)]*\)', '', regex=True).str.strip()

    # Aggregate by Player, Match Type, and Match ID
    agg_df = master_df.groupby(['player_name', 'match_type', 'match_id']).agg({
        'runs': 'sum',
        'balls_faced': 'sum',
        'fours': 'sum',
        'sixes': 'sum',
        'not_outs': 'sum',
        'strike_rate': 'mean', 
        'avg': 'max'
    }).reset_index()

    # Calculate Heuristic Features
    agg_df['power_play_impact'] = ((agg_df['strike_rate'] * 0.4) + (agg_df['fours'] * 2.0)).clip(0, 100)
    agg_df['match_winning_impact'] = ((agg_df['avg'] * 0.8) + (agg_df['runs'] / 10)).clip(0, 100)
    agg_df['death_overs_efficiency'] = ((agg_df['strike_rate'] * 0.3) + (agg_df['sixes'] * 5.0)).clip(0, 100)
    agg_df['pressure_handling'] = ((agg_df['not_outs'] * 15) + (agg_df['avg'] * 0.5)).clip(0, 100)
    agg_df['boundary_consistency'] = (((agg_df['fours'] + agg_df['sixes']) / agg_df['balls_faced'].replace(0, 1)) * 300).clip(0, 100)
    agg_df['confidence_interval'] = (100 - abs(agg_df['strike_rate'] - 130) / 2).clip(30, 95) / 100

    # Calculate Form Index independently per player and match format
    agg_df = agg_df.sort_values(['player_name', 'match_type', 'match_id'])
    agg_df['form_index'] = agg_df.groupby(['player_name', 'match_type'])['runs'].transform(
        lambda x: x.ewm(alpha=0.3).mean()
    )

    if not os.path.exists('data'): 
        os.makedirs('data')
    agg_df.to_csv('data/processed_features.csv', index=False)
    print(f"Success! Processed {len(agg_df)} records grouped by player and format.")

if __name__ == "__main__":
    process_all_datasets('data/')