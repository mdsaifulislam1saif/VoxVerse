import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
import torch

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Base directory
    BASE_DIR: Path = Path(__file__).resolve().parent.parent

    # Application settings
    APP_NAME: str = os.getenv("APP_NAME", "Realistic Audio Generator")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Security settings
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "your-secret-key-for-development"
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
    )
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    # File storage
    AUDIO_DIR: Path = BASE_DIR / "temp" / "audio"

    # Ensure directories exist
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    # CORS (Cross-Origin Resource Sharing)
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://localhost:8000"
    ).split(",")

    # Device settings
    DEVICE: str = str(torch.device("cuda" if torch.cuda.is_available() else "cpu"))

    # Google Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "AIzaSyBL9cZFHiODeiZsEkeIx26RpTxqZpsPNW4")

    # Maximum text length for summarization (characters)
    MAX_SUMMARIZATION_LENGTH: int = 50000

    # Audio output directory (where TTS files are saved)
    AUDIO_OUTPUT_DIR: Path = Path("audio_output")
    
    # Default summary types
    SUMMARY_TYPES = ["brief", "detailed", "bullet_points"]

    # Supported languages for summarization
    SUPPORTED_LANGUAGES = {
        "bn", "ja", "zh-cn", "zh-tw", "ko", "ru", "bg", "be", "uk",
        "cs", "pl", "sk", "da", "no", "sv", "nl", "de", "fr", "it",
        "es", "pt", "en"
    }

    # Language model
    LANG_TO_MODEL = {
        'en': 'tts_models/en/ljspeech/fast_pitch',
        'bn': 'tts_models/bn/custom/vits-male',
        'ja': 'tts_models/ja/kokoro/tacotron2-DDC',
        'fr': 'tts_models/fr/mai/tacotron2-DDC',
        'de': 'tts_models/de/thorsten/tacotron2-DDC',
        'es': 'tts_models/es/mai/tacotron2-DDC',
        'it': 'tts_models/it/mai_female/glow-tts',
        'nl': 'tts_models/nl/mai/tacotron2-DDC',
        'pt': 'tts_models/pt/cv/vits',
        'pl': 'tts_models/pl/mai_female/vits',
        'tr': 'tts_models/tr/common-voice/glow-tts',
        'zh-cn': 'tts_models/zh-CN/baker/tacotron2-DDC-GST',
        'bg': 'tts_models/bg/cv/vits',
        'cs': 'tts_models/cs/cv/vits',
        'da': 'tts_models/da/cv/vits',
        'et': 'tts_models/et/cv/vits',
        'ga': 'tts_models/ga/cv/vits',
        'el': 'tts_models/el/cv/vits',
        'fi': 'tts_models/fi/css10/vits',
        'hr': 'tts_models/hr/cv/vits',
        'hu': 'tts_models/hu/css10/vits',
        'lt': 'tts_models/lt/cv/vits',
        'lv': 'tts_models/lv/cv/vits',
        'mt': 'tts_models/mt/cv/vits',
        'ro': 'tts_models/ro/cv/vits',
        'sk': 'tts_models/sk/cv/vits',
        'sl': 'tts_models/sl/cv/vits',
        'sv': 'tts_models/sv/cv/vits',
        'uk': 'tts_models/uk/mai/vits',
        'ca': 'tts_models/ca/custom/vits',
        'fa': 'tts_models/fa/custom/glow-tts',
        'be': 'tts_models/be/common-voice/glow-tts'
    }

    # Model
    GEMINI_MODEL = 'gemini-2.0-flash'

    # Instructions based on language
    LANGUAGE_INSTRUCTIONS = {
        "en": "Please provide the summary in English.",
        "bn": "দয়া করে বাংলায় সারসংক্ষেপ প্রদান করুন।",
        "ja": "日本語で要約を提供してください。",
        "es": "Por favor, proporciona el resumen en español.",
        "fr": "Veuillez fournir le résumé en français.",
        "de": "Bitte stellen Sie die Zusammenfassung auf Deutsch bereit.",
        "it": "Si prega di fornire il riassunto in italiano.",
        "pt": "Por favor, forneça o resumo em português.",
        "ru": "Пожалуйста, предоставьте резюме на русском языке.",
        "ko": "한국어로 요약을 제공해 주세요.",
        "zh-cn": "请用简体中文提供摘要。",
        "zh-tw": "請用繁體中文提供摘要。",
        "ar": "يرجى تقديم الملخص باللغة العربية.",
        "hi": "कृपया हिंदी में सारांश प्रदान करें।",
        "bg": "Моля, предоставете резюме на български език.",
        "be": "Калі ласка, прадастаўце рэзюмэ на беларускай мове.",
        "uk": "Будь ласка, надайте резюме українською мовою.",
        "cs": "Prosím, poskytněte shrnutí v češtině.",
        "pl": "Proszę podać streszczenie w języku polskim.",
        "sk": "Prosím, poskytnite zhrnutie v slovenčine.",
        "da": "Venligst giv resumeet på dansk.",
        "no": "Vennligst gi sammendraget på norsk.",
        "sv": "Vänligen ge sammanfattningen på svenska.",
        "nl": "Geef alstublieft de samenvatting in het Nederlands."
    }
    
    # summary type
    BRIEF = "Create a brief, concise summary in 2-3 sentences that captures the main points."
    DETAILED = "Create a detailed summary that covers all important points, key details, and main arguments. Include relevant context and supporting information."
    BULLET_POINTS = "Create a summary using bullet points that highlight the key points, main ideas, and important details in an organized format."

# Instantiate settings object for global use
settings = Settings()
