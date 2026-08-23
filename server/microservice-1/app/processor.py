import spacy
import re
from app.utils.constants import PERFORMANCE_KEYWORDS


try:
    nlp = spacy.load("en_core_web_sm")
except OSError:

    raise ImportError("spaCy model 'en_core_web_sm' not found. Please install it.")

def extract_player_performance(news_text):
   

    doc = nlp(news_text)
    player_performances = {}

   
    players = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    
    unique_players = list(set(players))

    for player in unique_players:
       
        player_score = 0
        

        for sent in doc.sents:
            if player in sent.text:
                sentence_text = sent.text.lower()
                
               
                # PERFORMANCE_KEYWORDS: {"wicket": 1.5, "century": 2.5, "runs": 0.5, etc.}
                for keyword, weight in PERFORMANCE_KEYWORDS.items():
                    if re.search(rf'\b{keyword}\b', sentence_text):
                        player_score += weight
        
        
        if player_score > 0:
           
            player_performances[player] = min(player_score, 10.0)

    return player_performances

# Testing code (Optional)
if __name__ == "__main__":
    sample_news = "Virat Kohli scored a brilliant century while Jasprit Bumrah took 5 wickets in the last match."
    print(extract_player_performance(sample_news))