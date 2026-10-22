from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class EducationBase(BaseModel):
    qualification: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    branch: Optional[str] = None
    institution: Optional[str] = None
    college_name: Optional[str] = None
    start_year: Optional[str] = None
    graduation_year: Optional[str] = None
    expected_graduation_date: Optional[str] = None
    cgpa: Optional[str] = None
    percentage: Optional[str] = None
    grading_scale: Optional[str] = "10.0"
    backlogs: Optional[str] = "0"
    coursework: Optional[str] = None
    achievements: Optional[str] = None
    verification_status: Optional[str] = "User Verified"


class EducationCreate(EducationBase):
    pass


class EducationUpdate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int
    profile_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
