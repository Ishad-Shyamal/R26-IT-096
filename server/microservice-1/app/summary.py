import os
import google.generativeai as genai


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def generate_player_summary(player_name, role, stats, news_headlines):
    prompt = f"""
    You are an expert cricket analyst for an IPL and National Team selection engine. 
    Generate a structured Markdown overview for player '{player_name}'.

    Context Data:
    - Role: {role}
    - Key Stats: {stats}
    - Recent News & Sentiment Context: {news_headlines}

    Format strictly in Markdown with these two sections:
    ### Player Overview
    - **Born / Origin**: [Detail or Unknown]
    - **Batting Style**: [Detail or Unknown]
    - **Bowling Style**: [Detail or Unknown]
    - **Playing Role**: {role}

    ### Career Highlights & Domestic Context
    - **Core Role**: Key functional contribution to the squad.
    - **Performance Context**: Insights based on provided stats.
    - **Media & Sentiment Signal**: Summary of recent news highlights and selection trajectory.
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating profile summary: {str(e)}"