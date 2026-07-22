"""
Configuration settings for InsightIQ backend
"""

from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "InsightIQ"
    VERSION: str = "0.1.0"

    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = "sqlite:///./data/insightiq.db"

    # File Storage
    UPLOAD_DIR: str = "./data/uploads"
    REPORTS_DIR: str = "./data/reports"

    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]

    # Email Settings (for reporting)
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = ""
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "info@example.com"
    EMAILS_FROM_NAME: str = "InsightIQ"

    # Redis (for caching)
    REDIS_URL: str = "redis://localhost:6379"

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379"

    # Feature Flags
    ENABLE_SIGNUP: bool = True
    ENABLE_INSIGHTS_GENERATION: bool = True
    ENABLE_FORECASTING: bool = True
    ENABLE_REPORTING: bool = True

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()