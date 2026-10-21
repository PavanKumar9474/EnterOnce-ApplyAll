import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models import (
    User, CandidateProfile, EducationRecord, ExperienceRecord,
    SkillRecord, ProjectRecord, ResumeRecord, ExtensionSession, AuditLog
)
from app.services.profile_service import seed_default_user
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)

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
