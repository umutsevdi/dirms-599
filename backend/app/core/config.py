from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Disaster Management System API"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/disaster_mgmt"

    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    MAGIC_LINK_EXPIRE_HOURS: int = 6

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Email (Options: console, resend)
    EMAIL_BACKEND: str = "console"  # Use "resend" for production
    RESEND_API_KEY: str = ""  # Required when EMAIL_BACKEND=resend
    FROM_EMAIL: str = "noreply@disaster-mgmt.local"  # Must be verified in Resend

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
