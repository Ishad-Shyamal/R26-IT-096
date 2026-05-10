import pandas as pd
import glob
import os
import re

def process_all_datasets(input_folder):
    # 1. Find all CSV files
    all_files = glob.glob(os.path.join(input_folder, "*.csv"))
    if not all_files:
        print(f"Error: No CSV files found in {input_folder}")
        return

    li = []
    print(f"Found {len(all_files)} files. Normalizing columns...")

    for filename in all_files:
        try:
            df = pd.read_csv(filename, index_col=None, header=0)
            
            # Extract year or filename as a fallback match identifier
            basename = os.path.basename(filename)
            year_match = re.search(r'20\d{2}', basename)
            fallback_id = year_match.group(0) if year_match else basename

            # 2. COLUMN NORMALIZATION
            # Convert all columns to lowercase and remove extra spaces
            df.columns = df.columns.str.strip().str.lower()

            # Rename common variations to our standard names
            column_mapping = {
                'player name': 'player_name',
                'player': 'player_name',
                'name': 'player_name',
                'match id': 'match_id',
                'id': 'match_id',
                'scorecard': 'match_id',
                'match date': 'match_id', 
                'batter runs': 'runs',
                'batsman_runs': 'runs',
                'runs scored': 'runs',
                'score': 'runs'
            }
            df.rename(columns=column_mapping, inplace=True)
            
            # Handle duplicate columns after renaming (e.g. if 'Player Name' and 'Player' both existed)
            df = df.loc[:, ~df.columns.duplicated()]
            
            # If match_id is missing, use fallback
            if 'match_id' not in df.columns:
                df['match_id'] = fallback_id
                
            # If runs is missing, default to 0
            if 'runs' not in df.columns:
                df['runs'] = 0
            
            # Keep only the columns we need
            required = ['player_name', 'match_id', 'runs']
            available = [col for col in required if col in df.columns]
            
            if 'player_name' not in available:
                continue
                
            li.append(df[available])
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    if not li:
        print("No valid data found in any CSV file.")
        return

    # 3. COMBINE DATA
    master_df = pd.concat(li, axis=0, ignore_index=True)

    # Clean up player names (remove country codes in parentheses)
    master_df['player_name'] = master_df['player_name'].str.replace(r'\s*\([^)]*\)', '', regex=True).str.strip()

    # Convert 'runs' to numeric, handling any non-numeric data
    master_df['runs'] = pd.to_numeric(master_df['runs'], errors='coerce').fillna(0)

    # 4. AGGREGATION & EWMA
    player_stats = master_df.groupby(['player_name', 'match_id']).agg({'runs': 'sum'}).reset_index()

    # Sort by match_id to ensure EWMA is chronological
    player_stats = player_stats.sort_values(['player_name', 'match_id'])

    # Apply EWMA (Form Index)
    player_stats['form_index'] = player_stats.groupby('player_name')['runs'].transform(
        lambda x: x.ewm(alpha=0.3).mean()
    )

    # 5. SAVE
    if not os.path.exists('data'): os.makedirs('data')
    player_stats.to_csv('data/processed_features.csv', index=False)
    print(f"Success! 'data/processed_features.csv' created with {len(player_stats)} records.")

if __name__ == "__main__":
    process_all_datasets('data/')