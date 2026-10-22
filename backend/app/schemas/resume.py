from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    filename: str
    file_size: int
    mime_type: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResumeExtractionResult(BaseModel):
    resume_id: int
    extracted_text_preview: str
    parsed_profile: Dict[str, Any]
    detected_fields: List[str]
    confidence_score: float
