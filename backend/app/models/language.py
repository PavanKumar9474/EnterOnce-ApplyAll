from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class LanguageRecord(Base):
    __tablename__ = "language_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    name = Column(String(100), nullable=False) # e.g. English, Spanish, Hindi
    proficiency = Column(String(50), default="Fluent", nullable=False) # Native, Fluent, Professional, Intermediate, Basic
    can_read = Column(String(20), default="Yes", nullable=True) # Yes / No
    can_write = Column(String(20), default="Yes", nullable=True) # Yes / No
    can_speak = Column(String(20), default="Yes", nullable=True) # Yes / No

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="languages")
