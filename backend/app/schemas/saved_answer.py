from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SavedAnswerBase(BaseModel):
    question_key: str
    question_text: str
    answer: str
    company: Optional[str] = None
    input_type: Optional[str] = "text"
    category: Optional[str] = "General"
    requires_confirmation: Optional[int] = 0


class SavedAnswerCreate(SavedAnswerBase):
    pass


class SavedAnswerUpdate(BaseModel):
    question_key: Optional[str] = None
    question_text: Optional[str] = None
    answer: Optional[str] = None
    company: Optional[str] = None
    input_type: Optional[str] = None
    category: Optional[str] = None
    requires_confirmation: Optional[int] = None


class SavedAnswerResponse(SavedAnswerBase):
    id: int
    profile_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
