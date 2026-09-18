import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env file automatically
_backend_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv(_backend_dir / ".env")
load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "SHAGHOOF AI Enterprise Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "shaghoof-super-secret-production-key-2026-v2")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    
    # CORS Origins (Scoped for Production Security)
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000"
    ]
    
    # Rate Limiting Controls
    RATE_LIMIT_PER_MINUTE: str = "60/minute"
    
    class Config:
        case_sensitive = True

settings = Settings()
