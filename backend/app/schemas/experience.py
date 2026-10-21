from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ExperienceBase(BaseModel):
    company: str
    title: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    verification_status: Optional[str] = "User Verified"


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    verification_status: Optional[str] = None


class ExperienceResponse(ExperienceBase):
    id: int
    profile_id: int
    created_at: datetime

    class Config:
        from_attributes = True
