import re
import string

def clean_news_text(text: str) -> str:
    """
    පුවත් ලිපියක ඇති අනවශ්‍ය සංකේත, HTML tags සහ අමතර හිස්තැන් ඉවත් කර 
    NLP විශ්ලේෂණයට සුදුසු පරිදි පිරිසිදු කරයි.
    """
    if not text:
        return ""

    # 1. HTML Tags ඉවත් කිරීම (Scraping කිරීමේදී ඉතිරි වූ දේවල් තිබේ නම්)
    text = re.sub(r'<.*?>', '', text)

    # 2. URLs සහ Web Links ඉවත් කිරීම
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

    # 3. Emails ඉවත් කිරීම
    text = re.sub(r'\S+@\S+', '', text)

    # 4. විශේෂ සංකේත ඉවත් කිරීම (නමුත් ක්‍රීඩකයන්ගේ නම්වල ඇති තිත් සහ ඉරි ඉතිරි කරයි)
    # උදා: "A.B. de Villiers" හෝ "Rassie van der Dussen"
    text = re.sub(r'[^\w\s\.\-]', '', text)

    # 5. අමතර හිස්තැන් (New lines/Extra spaces) ඉවත් කිරීම
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def preprocess_for_scoring(text: str) -> str:
    """
    ලකුණු ගණනය කිරීමේදී (Keyword matching) පහසු වීම සඳහා 
    සියල්ල lowercase කර පිරිසිදු කරයි.
    """
    cleaned_text = clean_news_text(text)
    return cleaned_text.lower()

# Testing (Optional)
if __name__ == "__main__":
    raw_news = "Breaking News! <p>Virat Kohli scored 100*.</p> Visit https://sports.com for more @admin"
    print(f"Original: {raw_news}")
    print(f"Cleaned: {clean_news_text(raw_news)}")