"""
Core application configuration using Pydantic Settings v2
Latest FastAPI 2024 best practices
"""

from functools import lru_cache
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Project info
    PROJECT_NAME: str = "SIH Project API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for SIH Project with React Native frontend"
    
    # API configuration
    API_V1_STR: str = "/api/v1"
    
    # CORS settings - configure for React Native and Expo Go
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:8081",      # Expo dev server
        "http://localhost:19000",     # Expo dev tools
        "http://localhost:19006",     # Expo web
        "http://192.168.1.4:8081",    # Expo on your computer's IP
        "http://192.168.1.*:8081",    # Any device on your local network
        "exp://192.168.1.*:8081",     # Expo protocol
        "http://192.168.1.4:*",       # Any port on your computer
        "*"  # Allow all for development - restrict in production
    ]
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql://username:password@localhost:5432/sih_database",
        description="PostgreSQL Database URL"
    )
    
    # Security
    SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        description="Secret key for JWT tokens"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = Field(default="development", description="Environment name")
    DEBUG: bool = Field(default=True, description="Debug mode")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()