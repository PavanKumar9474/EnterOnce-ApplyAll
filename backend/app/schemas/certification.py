from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CertificationBase(BaseModel):
    name: str
    issuing_organization: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    description: Optional[str] = None
    verification_status: Optional[str] = "User Verified"


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    description: Optional[str] = None
    verification_status: Optional[str] = None


class CertificationResponse(CertificationBase):
    id: int
    profile_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
