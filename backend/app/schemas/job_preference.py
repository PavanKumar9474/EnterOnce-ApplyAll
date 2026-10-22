from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class JobPreferenceBase(BaseModel):
    desired_job_titles: Optional[str] = None
    preferred_locations: Optional[str] = None
    work_modes: Optional[str] = "Remote, Hybrid"
    employment_types: Optional[str] = "Full-time"
    expected_salary: Optional[str] = None
    earliest_joining_date: Optional[str] = None
    notice_period: Optional[str] = None
    relocation_preference: Optional[str] = "Yes"
    target_industries: Optional[str] = None
    target_technologies: Optional[str] = None


class JobPreferenceCreate(JobPreferenceBase):
    pass


class JobPreferenceUpdate(JobPreferenceBase):
    pass


class JobPreferenceResponse(JobPreferenceBase):
    id: int
    profile_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
