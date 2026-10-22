from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.education import EducationResponse
from app.schemas.experience import ExperienceResponse
from app.schemas.skill import SkillResponse
from app.schemas.project import ProjectResponse
from app.schemas.certification import CertificationResponse
from app.schemas.language import LanguageResponse
from app.schemas.job_preference import JobPreferenceResponse
from app.schemas.saved_answer import SavedAnswerResponse


class ProfileBase(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    preferred_name: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    country_code: Optional[str] = "+1"
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    notice_period: Optional[str] = None
    work_authorization: Optional[str] = None
    visa_status: Optional[str] = None
    willingness_to_relocate: Optional[str] = None
    preferred_location: Optional[str] = None
    preferred_work_mode: Optional[str] = "Hybrid"
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

    model_config = ConfigDict(from_attributes=True)


class FullProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    educations: List[EducationResponse] = []
    experiences: List[ExperienceResponse] = []
    skills: List[SkillResponse] = []
    projects: List[ProjectResponse] = []
    certifications: List[CertificationResponse] = []
    languages: List[LanguageResponse] = []
    preference: Optional[JobPreferenceResponse] = None
    saved_answers: List[SavedAnswerResponse] = []

    model_config = ConfigDict(from_attributes=True)
