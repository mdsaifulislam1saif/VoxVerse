import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
import torch

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Base directory
    BASE_DIR: str = Path(__file__).resolve().parent.parent

    # Application settings
    APP_NAME: str = "Realistic Audio Generator"
    # API_V1_STR = "/api/v1"

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: str = 30

    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    # File storage
    UPLOAD_DIR: str = BASE_DIR / "temp" / "uploads"
    AUDIO_DIR: str = BASE_DIR / "temp" / "audio"

    # Ensure directories exist
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    # CORS (Cross-Origin Resource Sharing)
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",   # React + Vite
        "http://localhost:3000",   # React CRA
        "http://localhost:8000"    # FastAPI docs
    ]
    # Device settings
    DEVICE: str = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


    # Google Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Maximum text length for summarization (characters)
    MAX_SUMMARIZATION_LENGTH: int = 50000
    
    # Audio output directory (where TTS files are saved)
    AUDIO_OUTPUT_DIR: Path = Path("audio_output")
    
    # Default summary types
    SUMMARY_TYPES = ["brief", "detailed", "bullet_points"]
    
    # Supported languages for summarization
    SUPPORTED_LANGUAGES = [
        "en", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", 
        "zh", "ar", "hi", "bn", "nl", "sv", "da", "no", "fi"
    ]
    

# Instantiate settings object for global use
settings = Settings()
