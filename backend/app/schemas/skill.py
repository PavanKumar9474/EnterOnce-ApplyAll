from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = "Technical"
    proficiency: Optional[str] = "Intermediate"
    verification_status: Optional[str] = "User Verified"


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int
    profile_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
