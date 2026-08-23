import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import motor.motor_asyncio
from datetime import datetime
import pandas as pd
import google.generativeai as genai

from app.processor import extract_player_performance
from app.geopolitical import detect_geopolitical_signals
from app.predictor import predict_ipl_probability

load_dotenv()

app = FastAPI(title="InsightCric News Intelligence Hub")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "news_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "news_analysis")

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# MongoDB Client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.get_database(DB_NAME)
news_collection = database.get_collection(COLLECTION_NAME)


@app.get("/players-predictions")
async def get_all_predictions():
    
    try:
        dataset_path = 'app/training/final_ml_dataset.csv' 
        
        if not os.path.exists(dataset_path):
            raise HTTPException(status_code=404, detail=f"Dataset file '{dataset_path}' not found!")

        
        df = pd.read_csv(dataset_path)
        players_list = []
        
        
        for index, row in df.iterrows():
            perf = float(row.get('performance_score', 0))
            marker = float(row.get('marker_score', 0))
            
            
            country_val = (
                row.get('country') or 
                row.get('Country') or 
                row.get('team') or 
                row.get('Team') or 
                row.get('national_team') or 
                'Unknown'
            )
            
            
            prob_raw = predict_ipl_probability(performance_score=perf, marker_score=marker)
            
            
            if prob_raw == 0 and (perf > 0 or marker > 0):
                prob_float = ((perf / 2000.0) * 0.7) + ((marker / 10.0) * 0.3)
                prob_float = round(min(1.0, max(0.0, prob_float)), 4)
            else:
                if isinstance(prob_raw, str):
                    prob_float = float(prob_raw.replace("%", "")) / 100.0
                else:
                    prob_float = float(prob_raw) / 100.0 if prob_raw > 1 else float(prob_raw)
            
            #
            player_data = {
                "player_name": str(row.get('Player', row.get('player_name', f"Player {index + 1}"))),
                "country": str(country_val).strip(),  
                "team": str(country_val).strip(),     
                "performance_score": perf,
                "marker_score": marker,
                "iplProb": prob_float,
                "nationalProb": prob_float,           
                "was_selected": int(row.get('was_selected', 1 if prob_float >= 0.5 else 0)),
                "role": str(row.get('role', 'All-Rounder'))
            }
            players_list.append(player_data)
            
        return players_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing dataset: {str(e)}")


@app.get("/player-summary/{player_name}")
async def get_player_summary(player_name: str):
    """
    Player Profile එක ඇතුළේ Display කිරීමට Dynamic LLM Structured Overview Generator Endpoint එක.
    """
    try:
        dataset_path = 'app/training/final_ml_dataset.csv'
        player_info = {}
        
        if os.path.exists(dataset_path):
            df = pd.read_csv(dataset_path)
            # Case-insensitive name matching
            matched = df[df['Player'].str.lower() == player_name.lower()] if 'Player' in df.columns else pd.DataFrame()
            if not matched.empty:
                row = matched.iloc[0]
                player_info = {
                    "role": row.get('role', 'All-Rounder'),
                    "performance_score": row.get('performance_score', 0),
                    "marker_score": row.get('marker_score', 0),
                    "country": row.get('country', row.get('Country', 'Unknown'))
                }

        role = player_info.get("role", "Professional Cricketer")
        perf = player_info.get("performance_score", "N/A")
        marker = player_info.get("marker_score", "N/A")
        country = player_info.get("country", "Unknown")

        prompt = f"""
        You are an elite cricket analyst. Produce a crisp, structured overview in Markdown for cricket candidate: '{player_name}'.
        
        Context Attributes:
        - Country/Team: {country}
        - Primary Role: {role}
        - Performance Score (Stats): {perf}
        - Marker Score (Media Sentiment): {marker}

        Generate the response strictly using this Markdown template (do not change section titles):

        ### Player Overview
        - **Born / Origin**: [Provide state/city or Country: {country}]
        - **Batting Style**: [Identify or infer standard batting position style]
        - **Bowling Style**: [Identify or infer bowling style based on role]
        - **Playing Role**: {role}

        ### Career Highlights & Domestic Context
        - **Specialist Profile**: Concise statement summarizing key role in squad composition.
        - **Statistical Impact**: Summary of current form evaluated via Performance Score ({perf}).
        - **Media & Selection Signal**: Insights derived from recent media sentiment and marker score ({marker}).
        """

        if not GEMINI_API_KEY:
            # Fallback markdown output if API key is not configured
            fallback_md = f"### Player Overview\n- **Born / Origin**: {country}\n- **Batting Style**: Right-hand bat\n- **Bowling Style**: Right-arm medium\n- **Playing Role**: {role}\n\n### Career Highlights & Domestic Context\n- **Specialist Profile**: Key functional contributor in team setup.\n- **Statistical Impact**: Evaluated with baseline performance score of {perf}.\n- **Media & Selection Signal**: Marker score of {marker} indicates stable media sentiment."
            return {"player_name": player_name, "summary": fallback_md}

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        return {
            "player_name": player_name,
            "summary": response.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate player summary: {str(e)}")


@app.get("/")
async def root():
    return {"message": "InsightCric News Intelligence Service is Running"}


@app.post("/analyze-news")
async def analyze_news(news_content: str = Body(..., embed=True)):
    try:
        if not news_content:
            raise HTTPException(status_code=400, detail="News content cannot be empty")

        # NLP Processing
        performance_results = extract_player_performance(news_content)
        geo_signals = detect_geopolitical_signals(news_content)
        
        final_analysis = []
        
        for player, score in performance_results.items():
            probability = predict_ipl_probability(
                performance_score=score, 
                marker_score=0 
            )
            
            player_report = {
                "player_name": player,
                "news_performance_score": score,
                "ipl_selection_probability": f"{probability:.2f}%",
                "risk_impact": geo_signals.get("risk_level", "Low")
            }
            final_analysis.append(player_report)

        db_document = {
            "analysis_id": f"AC-{int(datetime.utcnow().timestamp())}",
            "original_news_snippet": news_content[:200] + "...",
            "processed_at": datetime.utcnow(),
            "results": final_analysis,
            "geopolitical_summary": geo_signals
        }
        
        try:
            await news_collection.insert_one(db_document)
        except Exception as db_error:
            print(f"Database insertion failed: {db_error}")
            
        return {
            "status": "success",
            "count": len(final_analysis),
            "data": final_analysis,
            "geopolitical_risks": geo_signals
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)