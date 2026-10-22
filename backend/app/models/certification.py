from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class CertificationRecord(Base):
    __tablename__ = "certification_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    name = Column(String(200), nullable=False) # e.g. AWS Certified Solutions Architect
    issuing_organization = Column(String(200), nullable=True) # e.g. Amazon Web Services
    issue_date = Column(String(50), nullable=True) # e.g. 2024-03
    expiration_date = Column(String(50), nullable=True) # e.g. 2027-03 or None
    credential_id = Column(String(100), nullable=True)
    verification_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="certifications")
