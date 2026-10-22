from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class LanguageBase(BaseModel):
    name: str
    proficiency: Optional[str] = "Fluent"
    can_read: Optional[str] = "Yes"
    can_write: Optional[str] = "Yes"
    can_speak: Optional[str] = "Yes"


class LanguageCreate(LanguageBase):
    pass


class LanguageUpdate(BaseModel):
    name: Optional[str] = None
    proficiency: Optional[str] = None
    can_read: Optional[str] = None
    can_write: Optional[str] = None
    can_speak: Optional[str] = None


class LanguageResponse(LanguageBase):
    id: int
    profile_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
