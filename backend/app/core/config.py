import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Rural Enterprise Intelligence Platform (GramUdyam)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security / Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://mock-supabase.local")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "mock-anon-key")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-key-for-sih-demo-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    ENABLE_REDIS_CACHE: bool = os.getenv("ENABLE_REDIS_CACHE", "true").lower() == "true"
    
    # AI Keys (Free-tier)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rural_enterprise.db")

settings = Settings()
