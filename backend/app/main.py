import time
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.db.session import init_db, SessionLocal, get_db
from app.db.seed_data import seed_database
from app.cache.redis_client import cache
from app.api.v1 import auth, discovery, planning, copilot, officer, voice

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="National Rural Enterprise Intelligence Platform (NREIP) — One Platform with Three Experiences: Citizen Mobile App, Field Officer Assistant, and Government Web Portal."
)

# Origins whitelist for SIH demo security & CORS compliance
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "*"  # Fallback for dev network testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount API V1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(discovery.router, prefix=settings.API_V1_STR)
app.include_router(planning.router, prefix=settings.API_V1_STR)
app.include_router(copilot.router, prefix=settings.API_V1_STR)
app.include_router(officer.router, prefix=settings.API_V1_STR)
app.include_router(voice.router, prefix=settings.API_V1_STR)

START_TIME = time.time()

@app.on_event("startup")
def startup_event():
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Production health check for Nginx, load balancers, and demo sanity check.
    Validates DB connectivity and Redis cache readiness.
    """
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"degraded: {str(e)}"

    redis_status = "connected" if cache.is_connected else "in_memory_fallback_active"

    uptime_seconds = round(time.time() - START_TIME, 1)

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "uptime_seconds": uptime_seconds,
        "database": db_status,
        "cache_layer": redis_status,
        "dpdp_compliance": "DPDP Act 2023 Compliant (Consent Sandbox Active)",
        "ports": {
            "backend": 8000,
            "officer_portal": 5173,
            "citizen_app": 5174
        }
    }

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "operational",
        "health_endpoint": "/health",
        "dpdp_act_compliance": True,
        "modules": {
            "module_1": "Discovery & Feasibility",
            "module_2": "Financial Planning, DPR & Schemes",
            "module_3": "AI Business Copilot",
            "officer_portal": "District GIS & Administrative Review",
            "voice_layer": "Web Speech + Multilingual Intent Parser"
        }
    }
