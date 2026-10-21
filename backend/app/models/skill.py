from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class SkillRecord(Base):
    __tablename__ = "skill_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    name = Column(String(100), nullable=False)
    category = Column(String(100), default="Technical", nullable=True) # Technical, Soft, Language, Tool
    proficiency = Column(String(50), default="Intermediate", nullable=True) # Beginner, Intermediate, Advanced, Expert
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="skills")
