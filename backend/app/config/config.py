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

# Instantiate settings object for global use
settings = Settings()
