from typing import List
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
from app.schemas.profile import FullProfileResponse, ProfileUpdate, ProfileResponse
from app.schemas.education import EducationCreate, EducationResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.skill import SkillCreate, SkillResponse
from app.schemas.project import ProjectCreate, ProjectResponse
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
