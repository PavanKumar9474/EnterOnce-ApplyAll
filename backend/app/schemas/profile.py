from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.schemas.education import EducationResponse, EducationCreate
from app.schemas.experience import ExperienceResponse, ExperienceCreate
from app.schemas.skill import SkillResponse, SkillCreate
from app.schemas.project import ProjectResponse, ProjectCreate


class ProfileBase(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    notice_period: Optional[str] = None
    work_authorization: Optional[str] = None
    willingness_to_relocate: Optional[str] = None
    preferred_location: Optional[str] = None
    experience_years: Optional[str] = None
    bio: Optional[str] = None
    verification_status: Optional[str] = "User Verified"


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FullProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    educations: List[EducationResponse] = []
    experiences: List[ExperienceResponse] = []
    skills: List[SkillResponse] = []
    projects: List[ProjectResponse] = []

    class Config:
        from_attributes = True
