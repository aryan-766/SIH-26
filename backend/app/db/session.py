from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.models import Base

# Supports SQLite with check_same_thread False, as well as PostgreSQL connection strings
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        try:
            cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(schemes)")]
            new_cols = {
                "portal_url": "TEXT",
                "tags": "TEXT",
                "slug": "TEXT",
                "source": "TEXT DEFAULT 'National Portal of India (india.gov.in)'",
                "last_synced": "DATETIME"
            }
            for col_name, col_type in new_cols.items():
                if col_name not in cols:
                    conn.exec_driver_sql(f"ALTER TABLE schemes ADD COLUMN {col_name} {col_type}")
            conn.commit()
        except Exception:
            pass
