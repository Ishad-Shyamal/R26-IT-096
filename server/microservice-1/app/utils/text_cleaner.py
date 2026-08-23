import re
import string

def clean_news_text(text: str) -> str:
    
    if not text:
        return ""

    
    text = re.sub(r'<.*?>', '', text)

    
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

    
    text = re.sub(r'\S+@\S+', '', text)

    
    
    text = re.sub(r'[^\w\s\.\-]', '', text)

    
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def preprocess_for_scoring(text: str) -> str:
   
    cleaned_text = clean_news_text(text)
    return cleaned_text.lower()

# Testing (Optional)
if __name__ == "__main__":
    raw_news = "Breaking News! <p>Virat Kohli scored 100*.</p> Visit https://sports.com for more @admin"
    print(f"Original: {raw_news}")
    print(f"Cleaned: {clean_news_text(raw_news)}")