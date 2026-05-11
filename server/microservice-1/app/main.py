import os
from fastapi import FastAPI, HTTPException, Body
from dotenv import load_dotenv
import motor.motor_asyncio
from datetime import datetime


from app.processor import extract_player_performance
from app.geopolitical import detect_geopolitical_signals
from app.predictor import predict_ipl_probability

load_dotenv()

app = FastAPI(title="InsightCric News Intelligence Hub")

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "insightcric_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "news_analysis")

# MongoDB Client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.get_database(DB_NAME)
news_collection = database.get_collection(COLLECTION_NAME)

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
            # ML Model එක හරහා සම්භාවිතාව ගණනය කිරීම
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
            # Database එකට save නොවුණත්, analysis එක return කරයි

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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)