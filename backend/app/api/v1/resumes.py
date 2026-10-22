import os
import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.profile import CandidateProfile
from app.models.education import EducationRecord
from app.models.experience import ExperienceRecord
from app.models.skill import SkillRecord
from app.models.project import ProjectRecord
from app.models.resume import ResumeRecord
from app.schemas.resume import ResumeResponse, ResumeExtractionResult
from app.services.resume_parser import extract_text_from_file, parse_resume_text
from app.services.profile_service import log_audit

router = APIRouter(prefix="/resumes", tags=["Resumes & Extraction"])


def ensure_storage_dir():
    resume_dir = os.path.join(settings.STORAGE_DIR, "resumes")
    os.makedirs(resume_dir, exist_ok=True)
    return resume_dir


@router.post("", response_model=ResumeExtractionResult)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Uploads a candidate PDF or DOCX resume, validates size and type, extracts text,
    and returns parsed profile entities for review before merging.
    """
    fn_lower = file.filename.lower()
    if not (fn_lower.endswith(".pdf") or fn_lower.endswith(".docx") or fn_lower.endswith(".doc")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX format resumes are supported."
        )

    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB."
        )

    # Save to disk securely
    storage_dir = ensure_storage_dir()
    safe_filename = f"{current_user.id}_{int(os.path.getmtime(storage_dir) if os.path.exists(storage_dir) else 0)}_{os.path.basename(file.filename)}"
    file_path = os.path.join(storage_dir, safe_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Extract text from PDF or DOCX
    try:
        extracted_text = extract_text_from_file(file_bytes, file.filename)
    except Exception as e:
        extracted_text = ""

    # Parse fields deterministically
    parsed_profile = parse_resume_text(extracted_text) if extracted_text else {}

    # Calculate detected fields count
    detected_fields = []
    personal = parsed_profile.get("personal", {})
    for k, v in personal.items():
        if v:
            detected_fields.append(f"personal.{k}")
    if parsed_profile.get("education"):
        detected_fields.append("education")
    if parsed_profile.get("experience"):
        detected_fields.append("experience")
    if parsed_profile.get("skills"):
        detected_fields.append(f"skills ({len(parsed_profile['skills'])})")

    confidence_score = min(1.0, len(detected_fields) * 0.12)

    resume_record = ResumeRecord(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_size=file_size,
        mime_type="application/pdf",
        extracted_text=extracted_text[:10000],  # preview length stored
        extracted_json=json.dumps(parsed_profile),
        status="extracted"
    )
    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)

    log_audit(db, current_user.id, "RESUME_UPLOADED", f"Uploaded resume: {file.filename}")

    return {
        "resume_id": resume_record.id,
        "extracted_text_preview": extracted_text[:1500] if extracted_text else "No extractable text found (scanned image PDF).",
        "parsed_profile": parsed_profile,
        "detected_fields": detected_fields,
        "confidence_score": round(confidence_score, 2)
    }


@router.get("", response_model=List[ResumeResponse])
def list_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists all resumes uploaded by the current user."""
    return db.query(ResumeRecord).filter(ResumeRecord.user_id == current_user.id).order_by(ResumeRecord.created_at.desc()).all()


@router.post("/{resume_id}/confirm")
def confirm_resume_extraction(
    resume_id: int,
    confirmed_data: Optional[Dict[str, Any]] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Applies extracted/reviewed resume data directly into candidate profile.
    Preserves existing user data unless new fields are populated.
    """
    resume = db.query(ResumeRecord).filter(
        ResumeRecord.id == resume_id,
        ResumeRecord.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    data = confirmed_data
    if not data and resume.extracted_json:
        data = json.loads(resume.extracted_json)

    if not data:
        raise HTTPException(status_code=400, detail="No extracted data available to apply.")

    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id, email=current_user.email)
        db.add(profile)
        db.flush()

    # Apply personal details
    personal = data.get("personal", {})
    if personal.get("firstName") and not profile.first_name:
        profile.first_name = personal["firstName"]
    if personal.get("lastName") and not profile.last_name:
        profile.last_name = personal["lastName"]
    if personal.get("fullName") and not profile.full_name:
        profile.full_name = personal["fullName"]
    if personal.get("phone") and not profile.phone:
        profile.phone = personal["phone"]
    if personal.get("linkedin") and not profile.linkedin:
        profile.linkedin = personal["linkedin"]
    if personal.get("github") and not profile.github:
        profile.github = personal["github"]
    if personal.get("portfolio") and not profile.portfolio:
        profile.portfolio = personal["portfolio"]

    profile.verification_status = "User Verified"

    # Apply education if none exists
    if data.get("education") and len(profile.educations) == 0:
        for edu in data["education"]:
            db.add(EducationRecord(
                profile_id=profile.id,
                qualification=edu.get("qualification", "Bachelors Degree"),
                degree=edu.get("degree"),
                major=edu.get("major"),
                institution=edu.get("institution"),
                graduation_year=str(edu.get("graduationYear", "2024")),
                cgpa=str(edu.get("cgpa")) if edu.get("cgpa") else None,
                percentage=str(edu.get("percentage")) if edu.get("percentage") else None,
                verification_status="User Verified"
            ))

    # Apply skills
    if data.get("skills"):
        existing_skill_names = {s.name.lower() for s in profile.skills}
        for skill_name in data["skills"]:
            if skill_name.lower() not in existing_skill_names:
                db.add(SkillRecord(
                    profile_id=profile.id,
                    name=skill_name,
                    category="Technical"
                ))

    # Apply experience if none exists
    if data.get("experience") and len(profile.experiences) == 0:
        for exp in data["experience"]:
            db.add(ExperienceRecord(
                profile_id=profile.id,
                company=exp.get("company", "Company"),
                title=exp.get("title", "Software Engineer"),
                is_current=True,
                verification_status="User Verified"
            ))

    resume.status = "applied"
    db.commit()
    log_audit(db, current_user.id, "RESUME_APPLIED", f"Applied extracted resume data to profile for resume ID {resume_id}")

    return {"message": "Extracted data successfully applied to candidate profile.", "profile_id": profile.id}


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a resume record and removes file from storage."""
    resume = db.query(ResumeRecord).filter(
        ResumeRecord.id == resume_id,
        ResumeRecord.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    if resume.file_path and os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except OSError:
            pass

    db.delete(resume)
    db.commit()
    return {"message": "Resume record and file deleted."}
