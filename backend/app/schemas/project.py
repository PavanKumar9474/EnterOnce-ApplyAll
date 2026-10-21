from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ProjectBase(BaseModel):
    title: str
    role: Optional[str] = None
    technologies: Optional[str] = None
    url: Optional[str] = None
    github_url: Optional[str] = None
    description: Optional[str] = None
    verification_status: Optional[str] = "User Verified"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    role: Optional[str] = None
    technologies: Optional[str] = None
    url: Optional[str] = None
    github_url: Optional[str] = None
    description: Optional[str] = None
    verification_status: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    profile_id: int
    created_at: datetime

    class Config:
        from_attributes = True
