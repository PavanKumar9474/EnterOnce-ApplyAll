from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.profile import CandidateProfile
from app.models.education import EducationRecord
from app.models.experience import ExperienceRecord
from app.models.skill import SkillRecord
from app.models.project import ProjectRecord
from app.models.certification import CertificationRecord
from app.models.language import LanguageRecord
from app.models.job_preference import JobPreferenceRecord
from app.models.saved_answer import SavedAnswerRecord
from app.schemas.profile import FullProfileResponse, ProfileUpdate, ProfileResponse
from app.schemas.education import EducationCreate, EducationResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.skill import SkillCreate, SkillResponse
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.certification import CertificationCreate, CertificationUpdate, CertificationResponse
from app.schemas.language import LanguageCreate, LanguageUpdate, LanguageResponse
from app.schemas.job_preference import JobPreferenceCreate, JobPreferenceUpdate, JobPreferenceResponse
from app.schemas.saved_answer import SavedAnswerCreate, SavedAnswerUpdate, SavedAnswerResponse
from app.services.profile_service import log_audit

router = APIRouter(prefix="/profile", tags=["Candidate Profile"])


def get_or_create_profile(user: User, db: Session) -> CandidateProfile:
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user.id).first()
    if not profile:
        profile = CandidateProfile(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            verification_status="Extracted"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("", response_model=FullProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns candidate profile including all educations, experiences, skills, and projects."""
    profile = get_or_create_profile(current_user, db)
    return profile


@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates candidate profile personal and career preference details."""
    profile = get_or_create_profile(current_user, db)
    update_data = profile_in.model_dump(exclude_unset=True)

    for field, val in update_data.items():
        setattr(profile, field, val)

    # Keep user's full_name in sync if updated
    if profile.full_name and profile.full_name != current_user.full_name:
        current_user.full_name = profile.full_name

    db.commit()
    db.refresh(profile)
    log_audit(db, current_user.id, "PROFILE_UPDATED", "Candidate profile updated.")

    from app.services.profile_service import dispatch_n8n_event
    dispatch_n8n_event("PROFILE_UPDATED", {
        "user_id": current_user.id,
        "profile_id": profile.id,
        "verification_status": profile.verification_status
    })

    return profile



# --- Education Records ---

@router.post("/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def add_education(
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    edu = EducationRecord(profile_id=profile.id, **edu_in.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@router.put("/education/{edu_id}", response_model=EducationResponse)
def update_education(
    edu_id: int,
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    edu = db.query(EducationRecord).filter(
        EducationRecord.id == edu_id,
        EducationRecord.profile_id == profile.id
    ).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found.")

    for field, val in edu_in.model_dump(exclude_unset=True).items():
        setattr(edu, field, val)
    db.commit()
    db.refresh(edu)
    return edu


@router.delete("/education/{edu_id}")
def delete_education(
    edu_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    edu = db.query(EducationRecord).filter(
        EducationRecord.id == edu_id,
        EducationRecord.profile_id == profile.id
    ).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found.")
    db.delete(edu)
    db.commit()
    return {"message": "Education record deleted."}


# --- Experience Records ---

@router.post("/experience", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def add_experience(
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    exp = ExperienceRecord(profile_id=profile.id, **exp_in.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/experience/{exp_id}", response_model=ExperienceResponse)
def update_experience(
    exp_id: int,
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    exp = db.query(ExperienceRecord).filter(
        ExperienceRecord.id == exp_id,
        ExperienceRecord.profile_id == profile.id
    ).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found.")

    for field, val in exp_in.model_dump(exclude_unset=True).items():
        setattr(exp, field, val)
    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/experience/{exp_id}")
def delete_experience(
    exp_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    exp = db.query(ExperienceRecord).filter(
        ExperienceRecord.id == exp_id,
        ExperienceRecord.profile_id == profile.id
    ).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found.")
    db.delete(exp)
    db.commit()
    return {"message": "Experience record deleted."}


# --- Skills ---

@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def add_skill(
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    skill = SkillRecord(profile_id=profile.id, **skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    skill = db.query(SkillRecord).filter(
        SkillRecord.id == skill_id,
        SkillRecord.profile_id == profile.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found.")
    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted."}


# --- Projects ---

@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def add_project(
    proj_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    proj = ProjectRecord(profile_id=profile.id, **proj_in.model_dump())
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj


@router.put("/projects/{proj_id}", response_model=ProjectResponse)
def update_project(
    proj_id: int,
    proj_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    proj = db.query(ProjectRecord).filter(
        ProjectRecord.id == proj_id,
        ProjectRecord.profile_id == profile.id
    ).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found.")

    for field, val in proj_in.model_dump(exclude_unset=True).items():
        setattr(proj, field, val)
    db.commit()
    db.refresh(proj)
    return proj


@router.delete("/projects/{proj_id}")
def delete_project(
    proj_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    proj = db.query(ProjectRecord).filter(
        ProjectRecord.id == proj_id,
        ProjectRecord.profile_id == profile.id
    ).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found.")
    db.delete(proj)
    db.commit()
    return {"message": "Project deleted."}


# --- Certifications ---

@router.post("/certifications", response_model=CertificationResponse, status_code=status.HTTP_201_CREATED)
def add_certification(
    cert_in: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    cert = CertificationRecord(profile_id=profile.id, **cert_in.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.put("/certifications/{cert_id}", response_model=CertificationResponse)
def update_certification(
    cert_id: int,
    cert_in: CertificationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    cert = db.query(CertificationRecord).filter(
        CertificationRecord.id == cert_id,
        CertificationRecord.profile_id == profile.id
    ).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found.")

    for field, val in cert_in.model_dump(exclude_unset=True).items():
        setattr(cert, field, val)
    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/certifications/{cert_id}")
def delete_certification(
    cert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    cert = db.query(CertificationRecord).filter(
        CertificationRecord.id == cert_id,
        CertificationRecord.profile_id == profile.id
    ).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found.")
    db.delete(cert)
    db.commit()
    return {"message": "Certification deleted."}


# --- Languages ---

@router.post("/languages", response_model=LanguageResponse, status_code=status.HTTP_201_CREATED)
def add_language(
    lang_in: LanguageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    lang = LanguageRecord(profile_id=profile.id, **lang_in.model_dump())
    db.add(lang)
    db.commit()
    db.refresh(lang)
    return lang


@router.put("/languages/{lang_id}", response_model=LanguageResponse)
def update_language(
    lang_id: int,
    lang_in: LanguageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    lang = db.query(LanguageRecord).filter(
        LanguageRecord.id == lang_id,
        LanguageRecord.profile_id == profile.id
    ).first()
    if not lang:
        raise HTTPException(status_code=404, detail="Language not found.")

    for field, val in lang_in.model_dump(exclude_unset=True).items():
        setattr(lang, field, val)
    db.commit()
    db.refresh(lang)
    return lang


@router.delete("/languages/{lang_id}")
def delete_language(
    lang_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    lang = db.query(LanguageRecord).filter(
        LanguageRecord.id == lang_id,
        LanguageRecord.profile_id == profile.id
    ).first()
    if not lang:
        raise HTTPException(status_code=404, detail="Language not found.")
    db.delete(lang)
    db.commit()
    return {"message": "Language deleted."}


# --- Job Preferences ---

@router.get("/preferences", response_model=Optional[JobPreferenceResponse])
def get_job_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    return profile.preference


@router.put("/preferences", response_model=JobPreferenceResponse)
def update_job_preferences(
    pref_in: JobPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    pref = profile.preference
    if not pref:
        pref = JobPreferenceRecord(profile_id=profile.id, **pref_in.model_dump(exclude_unset=True))
        db.add(pref)
    else:
        for field, val in pref_in.model_dump(exclude_unset=True).items():
            setattr(pref, field, val)
    db.commit()
    db.refresh(pref)
    return pref


# --- Screening Questions & Saved Answers ---

@router.get("/saved-answers", response_model=List[SavedAnswerResponse])
def get_saved_answers(
    company: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    query = db.query(SavedAnswerRecord).filter(SavedAnswerRecord.profile_id == profile.id)
    if company:
        query = query.filter(
            (SavedAnswerRecord.company == company) | (SavedAnswerRecord.company == None) | (SavedAnswerRecord.company == "")
        )
    return query.all()


@router.post("/saved-answers", response_model=SavedAnswerResponse, status_code=status.HTTP_201_CREATED)
def add_saved_answer(
    ans_in: SavedAnswerCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    # Check if this question key for this company already exists, update if so
    existing = db.query(SavedAnswerRecord).filter(
        SavedAnswerRecord.profile_id == profile.id,
        SavedAnswerRecord.question_key == ans_in.question_key,
        SavedAnswerRecord.company == ans_in.company
    ).first()

    if existing:
        existing.question_text = ans_in.question_text
        existing.answer = ans_in.answer
        existing.input_type = ans_in.input_type or existing.input_type
        db.commit()
        db.refresh(existing)
        return existing

    ans = SavedAnswerRecord(profile_id=profile.id, **ans_in.model_dump())
    db.add(ans)
    db.commit()
    db.refresh(ans)
    return ans


@router.put("/saved-answers/{answer_id}", response_model=SavedAnswerResponse)
def update_saved_answer(
    answer_id: int,
    ans_in: SavedAnswerUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    ans = db.query(SavedAnswerRecord).filter(
        SavedAnswerRecord.id == answer_id,
        SavedAnswerRecord.profile_id == profile.id
    ).first()
    if not ans:
        raise HTTPException(status_code=404, detail="Saved answer not found.")

    for field, val in ans_in.model_dump(exclude_unset=True).items():
        setattr(ans, field, val)
    db.commit()
    db.refresh(ans)
    return ans


@router.delete("/saved-answers/{answer_id}")
def delete_saved_answer(
    answer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = get_or_create_profile(current_user, db)
    ans = db.query(SavedAnswerRecord).filter(
        SavedAnswerRecord.id == answer_id,
        SavedAnswerRecord.profile_id == profile.id
    ).first()
    if not ans:
        raise HTTPException(status_code=404, detail="Saved answer not found.")
    db.delete(ans)
    db.commit()
    return {"message": "Saved answer deleted."}

