from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import CandidateProfile
from app.models.education import EducationRecord
from app.models.experience import ExperienceRecord
from app.models.skill import SkillRecord
from app.models.project import ProjectRecord
from app.models.audit import AuditLog
from app.core.security import get_password_hash


def format_profile_for_extension(profile: Optional[CandidateProfile]) -> Dict[str, Any]:
    """
    Transforms the relational candidate profile into the hierarchical JSON structure
    consumed by the ApplyOnce Chrome extension autofill engine.
    """
    if not profile:
        return {}

    # Education records
    education_list = []
    for edu in profile.educations:
        education_list.append({
            "id": edu.id,
            "qualification": edu.qualification or "",
            "degree": edu.degree or "",
            "major": edu.major or "",
            "institution": edu.institution or "",
            "graduationYear": edu.graduation_year or "",
            "cgpa": edu.cgpa or "",
            "percentage": edu.percentage or "",
            "gradingScale": edu.grading_scale or "",
            "backlogs": edu.backlogs or "0"
        })

    # Experience records
    experience_list = []
    primary_company = ""
    primary_title = ""
    for exp in profile.experiences:
        experience_list.append({
            "id": exp.id,
            "company": exp.company or "",
            "title": exp.title or "",
            "location": exp.location or "",
            "startDate": str(exp.start_date) if exp.start_date else "",
            "endDate": str(exp.end_date) if exp.end_date else ("Present" if exp.is_current else ""),
            "isCurrent": exp.is_current,
            "description": exp.description or ""
        })
        if not primary_company and exp.company:
            primary_company = exp.company
            primary_title = exp.title or ""

    # Skills list
    skills_list = [s.name for s in profile.skills]
    skills_string = ", ".join(skills_list)

    # Projects list
    projects_list = []
    for proj in profile.projects:
        projects_list.append({
            "id": proj.id,
            "title": proj.title,
            "description": proj.description or "",
            "technologies": proj.technologies or "",
            "projectUrl": proj.url or "",
            "githubUrl": proj.github_url or ""
        })

    full_name = profile.full_name
    if not full_name:
        parts = [p for p in [profile.first_name, profile.middle_name, profile.last_name] if p]
        full_name = " ".join(parts) if parts else ""

    return {
        "personal": {
            "firstName": profile.first_name or "",
            "middleName": profile.middle_name or "",
            "lastName": profile.last_name or "",
            "fullName": full_name,
            "email": profile.email or (profile.user.email if profile.user else ""),
            "phone": profile.phone or "",
            "address": profile.address or "",
            "city": profile.city or "",
            "state": profile.state or "",
            "postalCode": profile.postal_code or "",
            "country": profile.country or "",
            "linkedin": profile.linkedin or "",
            "github": profile.github or "",
            "portfolio": profile.portfolio or "",
            "noticePeriod": profile.notice_period or "",
            "workAuthorization": profile.work_authorization or "",
            "willingnessToRelocate": profile.willingness_to_relocate or "",
            "preferredLocation": profile.preferred_location or ""
        },
        "education": education_list,
        "experience": experience_list,
        "skills": skills_list,
        "projects": projects_list,
        "professional": {
            "experienceYears": profile.experience_years or "0",
            "currentCompany": primary_company,
            "currentTitle": primary_title,
            "skills": skills_string,
            "bio": profile.bio or ""
        },
        "meta": {
            "profileId": profile.id,
            "userId": profile.user_id,
            "verificationStatus": profile.verification_status,
            "updatedAt": profile.updated_at.isoformat() if profile.updated_at else None
        }
    }


def log_audit(db: Session, user_id: Optional[int], event_type: str, details: str = "", ip: str = ""):
    """Helper to record security and autofill audit logs."""
    log_entry = AuditLog(
        user_id=user_id,
        event_type=event_type,
        details=details,
        ip_address=ip
    )
    db.add(log_entry)
    db.commit()


def seed_default_user(db: Session) -> User:
    """
    Creates a pre-configured demo user and rich candidate profile for instant evaluation.
    Credentials: alex.morgan@example.com / Password123!
    """
    demo_email = "alex.morgan@example.com"
    existing_user = db.query(User).filter(User.email == demo_email).first()
    if existing_user:
        return existing_user

    demo_user = User(
        email=demo_email,
        hashed_password=get_password_hash("Password123!"),
        full_name="Alex James Morgan",
        is_active=True
    )
    db.add(demo_user)
    db.flush()

    demo_profile = CandidateProfile(
        user_id=demo_user.id,
        first_name="Alex",
        middle_name="James",
        last_name="Morgan",
        full_name="Alex James Morgan",
        email=demo_email,
        phone="+1 555-019-2834",
        address="742 Evergreen Terrace",
        city="San Francisco",
        state="California",
        postal_code="94107",
        country="United States",
        linkedin="https://linkedin.com/in/alexmorgan-dev",
        github="https://github.com/alexmorgandev",
        portfolio="https://alexmorgan.dev",
        notice_period="30",
        work_authorization="Yes",
        willingness_to_relocate="Yes",
        preferred_location="San Francisco, CA or Remote",
        experience_years="2",
        bio="Full Stack Software Engineer specializing in modern cloud architectures, React, and Python.",
        verification_status="User Verified"
    )
    db.add(demo_profile)
    db.flush()

    # Seed Education
    edu = EducationRecord(
        profile_id=demo_profile.id,
        qualification="Bachelors Degree",
        degree="Bachelor of Science",
        major="Computer Science",
        institution="Stanford University",
        graduation_year="2023",
        cgpa="3.85",
        percentage="92",
        grading_scale="4.0",
        backlogs="0",
        verification_status="User Verified"
    )
    db.add(edu)

    # Seed Experience
    exp = ExperienceRecord(
        profile_id=demo_profile.id,
        company="Acme Technologies",
        title="Full Stack Engineer",
        location="San Francisco, CA",
        is_current=True,
        description="Developed enterprise cloud services and high-scale frontends.",
        verification_status="User Verified"
    )
    db.add(exp)

    # Seed Skills
    skills = ["Python", "JavaScript", "TypeScript", "React", "FastAPI", "PostgreSQL", "Docker", "Git"]
    for s in skills:
        db.add(SkillRecord(profile_id=demo_profile.id, name=s, category="Technical"))

    # Seed Project
    proj = ProjectRecord(
        profile_id=demo_profile.id,
        title="ApplyOnce Autofill Engine",
        description="Universal career portal autofill engine using heuristic classification and accessibility signals.",
        technologies="JavaScript, Python, FastAPI, React",
        url="https://applyonce.dev",
        github_url="https://github.com/alexmorgandev/applyonce"
    )
    db.add(proj)

    db.commit()
    db.refresh(demo_user)
    return demo_user


def dispatch_n8n_event(event_type: str, payload: Dict[str, Any]) -> bool:
    """
    Safely dispatches webhook event metadata to the configured n8n automation service.
    Transmits only minimal event metadata and never unmasked personal details.
    """
    from app.core.config import settings
    import httpx
    from datetime import datetime, timezone

    if not settings.N8N_WEBHOOK_URL:
        return False

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "ApplyOnce-Backend/1.0"
    }
    if settings.N8N_WEBHOOK_SECRET:
        headers["X-ApplyOnce-Secret"] = settings.N8N_WEBHOOK_SECRET

    envelope = {
        "event": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": payload
    }

    try:
        with httpx.Client(timeout=3.0) as client:
            resp = client.post(settings.N8N_WEBHOOK_URL, json=envelope, headers=headers)
            return resp.status_code in [200, 201, 202]
    except Exception:
        # Non-blocking failure: external automation unavailability must not degrade core MVP
        return False

