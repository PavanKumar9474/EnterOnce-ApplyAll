from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class ExperienceRecord(Base):
    __tablename__ = "experience_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    company = Column(String(200), nullable=False)
    title = Column(String(150), nullable=False)
    location = Column(String(100), nullable=True)
    employment_type = Column(String(50), nullable=True) # Full-time, Internship, Contract
    start_date = Column(String(50), nullable=True)     # e.g. 2023-01 or Jan 2023
    end_date = Column(String(50), nullable=True)       # e.g. Present or 2024-05
    is_current = Column(Boolean, default=False, nullable=False)
    description = Column(Text, nullable=True)
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="experiences")
