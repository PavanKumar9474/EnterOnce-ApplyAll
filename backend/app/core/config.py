import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ApplyOnce Universal Career Autofill"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "applyonce-dev-secret-key-high-entropy-must-be-replaced-in-prod-xyz789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./applyonce.db")

    # Storage paths
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024 # 10 MB

    # Optional AI integration for structured resume extraction
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # N8N Automation Webhooks
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")
    N8N_WEBHOOK_SECRET: str = os.getenv("N8N_WEBHOOK_SECRET", "")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "chrome-extension://*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
