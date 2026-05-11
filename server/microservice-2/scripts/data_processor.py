import pandas as pd
import glob
import os
import re
import numpy as np

def process_all_datasets(input_folder):
    # 1. Find all CSV files
    all_files = glob.glob(os.path.join(input_folder, "*.csv"))
    if not all_files:
        print(f"Error: No CSV files found in {input_folder}")
        return

    li = []
    print(f"Found {len(all_files)} files. Normalizing columns and calculating advanced metrics...")

    for filename in all_files:
        try:
            df = pd.read_csv(filename, index_col=None, header=0)
            
            # Extract year or filename as a fallback match identifier
            basename = os.path.basename(filename)
            year_match = re.search(r'20\d{2}', basename)
            fallback_id = year_match.group(0) if year_match else basename

            # 2. COLUMN NORMALIZATION
            df.columns = df.columns.str.strip().str.lower()

            # Comprehensive mapping for all required metrics
            column_mapping = {
                'player name': 'player_name',
                'player': 'player_name',
                'name': 'player_name',
                'match id': 'match_id',
                'id': 'match_id',
                'scorecard': 'match_id',
                'match date': 'match_id',
                'runs scored': 'runs',
                'runs': 'runs',
                'batting strike rate': 'strike_rate',
                'sr': 'strike_rate',
                'balls faced': 'balls_faced',
                'bf': 'balls_faced',
                'boundary fours': 'fours',
                'fours': 'fours',
                '4s': 'fours',
                'boundary sixes': 'sixes',
                'sixes': 'sixes',
                '6s': 'sixes',
                'not outs': 'not_outs',
                'no': 'not_outs',
                'batting average': 'avg',
                'ave': 'avg'
            }
            df.rename(columns=column_mapping, inplace=True)
            
            # Handle duplicates and fallbacks
            df = df.loc[:, ~df.columns.duplicated()]
            if 'match_id' not in df.columns: df['match_id'] = fallback_id
            
            # Numeric conversion for all metric-relevant columns
            numeric_cols = ['runs', 'strike_rate', 'balls_faced', 'fours', 'sixes', 'not_outs', 'avg']
            for col in numeric_cols:
                if col in df.columns:
                    # Clean the data (remove '*' from runs/HS, handle non-numeric)
                    df[col] = pd.to_numeric(df[col].astype(str).str.replace('*', '', regex=False), errors='coerce').fillna(0)
                else:
                    df[col] = 0

            # Keep only the columns we need
            required = ['player_name', 'match_id'] + numeric_cols
            available = [col for col in required if col in df.columns]
            
            if 'player_name' not in available:
                continue
                
            li.append(df[available])
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    if not li:
        print("No valid data found.")
        return

    # 3. COMBINE AND CLEAN DATA
    master_df = pd.concat(li, axis=0, ignore_index=True)
    master_df['player_name'] = master_df['player_name'].str.replace(r'\s*\([^)]*\)', '', regex=True).str.strip()

    # 4. AGGREGATION & ADVANCED METRICS CALCULATION
    # Group by player and match_id (or year)
    agg_df = master_df.groupby(['player_name', 'match_id']).agg({
        'runs': 'sum',
        'balls_faced': 'sum',
        'fours': 'sum',
        'sixes': 'sum',
        'not_outs': 'sum',
        'strike_rate': 'mean', 
        'avg': 'max'
    }).reset_index()

    # Calculate Heuristic Metrics (Scale 0-100)
    # 1. Power Play Impact: Fours and SR based
    agg_df['power_play_impact'] = ((agg_df['strike_rate'] * 0.4) + (agg_df['fours'] * 2.0)).clip(0, 100)
    
    # 2. Match Winning Impact: Average and Runs based
    agg_df['match_winning_impact'] = ((agg_df['avg'] * 0.8) + (agg_df['runs'] / 10)).clip(0, 100)
    
    # 3. Death Overs Efficiency: Sixes and SR based
    agg_df['death_overs_efficiency'] = ((agg_df['strike_rate'] * 0.3) + (agg_df['sixes'] * 5.0)).clip(0, 100)
    
    # 4. Pressure Handling: Not Outs and Avg based
    agg_df['pressure_handling'] = ((agg_df['not_outs'] * 15) + (agg_df['avg'] * 0.5)).clip(0, 100)
    
    # 5. Boundary Consistency: Boundary % per ball
    agg_df['boundary_consistency'] = (((agg_df['fours'] + agg_df['sixes']) / agg_df['balls_faced'].replace(0, 1)) * 300).clip(0, 100)

    # 6. Confidence Interval: Simulated consistency
    agg_df['confidence_interval'] = (100 - abs(agg_df['strike_rate'] - 130) / 2).clip(30, 95) / 100

    # 5. FORM INDEX (EWMA)
    agg_df = agg_df.sort_values(['player_name', 'match_id'])
    agg_df['form_index'] = agg_df.groupby('player_name')['runs'].transform(
        lambda x: x.ewm(alpha=0.3).mean()
    )

    # 6. SAVE
    if not os.path.exists('data'): os.makedirs('data')
    agg_df.to_csv('data/processed_features.csv', index=False)
    print(f"Success! Processed {len(agg_df)} unique records with advanced metrics.")

if __name__ == "__main__":
    process_all_datasets('data/')