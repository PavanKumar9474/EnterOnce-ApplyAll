from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class EducationBase(BaseModel):
    qualification: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    institution: Optional[str] = None
    graduation_year: Optional[str] = None
    cgpa: Optional[str] = None
    percentage: Optional[str] = None
    grading_scale: Optional[str] = None
    backlogs: Optional[str] = "0"
    verification_status: Optional[str] = "User Verified"


class EducationCreate(EducationBase):
    pass


class EducationUpdate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int
    profile_id: int
    created_at: datetime

    class Config:
        from_attributes = True
