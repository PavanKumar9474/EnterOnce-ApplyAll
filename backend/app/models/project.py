from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class ProjectRecord(Base):
    __tablename__ = "project_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    title = Column(String(200), nullable=False)
    role = Column(String(100), nullable=True)
    technologies = Column(String(255), nullable=True) # e.g. Python, React, PostgreSQL
    url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="projects")
