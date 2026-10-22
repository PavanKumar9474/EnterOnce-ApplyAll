import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from sqlalchemy import text
from app.models import (
    User, CandidateProfile, EducationRecord, ExperienceRecord,
    SkillRecord, ProjectRecord, CertificationRecord, LanguageRecord,
    JobPreferenceRecord, SavedAnswerRecord, ResumeRecord, ExtensionSession, AuditLog
)
from app.services.profile_service import seed_default_user
from app.api.v1.router import api_router


def migrate_db_columns(engine):
    """
    Safely inspects existing SQLite tables and adds any missing columns dynamically
    without dropping or modifying existing data.
    """
    column_defs = {
        "candidate_profiles": [
            ("preferred_name", "VARCHAR(100)"),
            ("country_code", "VARCHAR(10) DEFAULT '+1'"),
            ("date_of_birth", "VARCHAR(30)"),
            ("visa_status", "VARCHAR(100)"),
            ("preferred_work_mode", "VARCHAR(50) DEFAULT 'Hybrid'"),
            ("photo_url", "VARCHAR(500)")
        ],
        "education_records": [
            ("branch", "VARCHAR(150)"),
            ("college_name", "VARCHAR(255)"),
            ("start_year", "VARCHAR(20)"),
            ("expected_graduation_date", "VARCHAR(30)"),
            ("coursework", "VARCHAR(500)"),
            ("achievements", "VARCHAR(500)")
        ],
        "experience_records": [
            ("work_mode", "VARCHAR(50) DEFAULT 'Hybrid'"),
            ("responsibilities", "TEXT"),
            ("technologies", "VARCHAR(255)"),
            ("notice_period", "VARCHAR(50)")
        ],
        "project_records": [
            ("responsibilities", "TEXT"),
            ("start_date", "VARCHAR(30)"),
            ("end_date", "VARCHAR(30)"),
            ("is_team_project", "BOOLEAN DEFAULT 0")
        ],
        "saved_answer_records": [
            ("category", "VARCHAR(100) DEFAULT 'General'"),
            ("requires_confirmation", "INTEGER DEFAULT 0")
        ]
    }

    with engine.connect() as conn:
        for table, cols in column_defs.items():
            try:
                result = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
                existing_cols = {row[1] for row in result}
                for col_name, col_type in cols:
                    if col_name not in existing_cols:
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}"))
                conn.commit()
            except Exception:
                pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)
    migrate_db_columns(engine)

    # Ensure storage directories exist
    os.makedirs(os.path.join(settings.STORAGE_DIR, "resumes"), exist_ok=True)

    # Seed demo user & rich candidate profile for frictionless testing
    db = SessionLocal()
    try:
        seed_default_user(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Universal Career Website Autofill Backend API. Provides candidate profile management, resume parsing, extension sync, and auditing.",
    lifespan=lifespan
)

# CORS configuration
# Note: Chrome extension origin looks like chrome-extension://<id>
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local web app, test forms, and chrome-extension
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION
    }


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
