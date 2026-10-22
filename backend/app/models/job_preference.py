from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class JobPreferenceRecord(Base):
    __tablename__ = "job_preference_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    desired_job_titles = Column(String(255), nullable=True) # e.g. "Full Stack Engineer, Backend Developer"
    preferred_locations = Column(String(255), nullable=True) # e.g. "San Francisco, CA; New York, NY; Remote"
    work_modes = Column(String(100), default="Remote, Hybrid", nullable=True) # Remote, Hybrid, Onsite
    employment_types = Column(String(100), default="Full-time", nullable=True) # Full-time, Internship, Contract
    expected_salary = Column(String(100), nullable=True) # e.g. "$120,000 / yr" or "INR 18 LPA"
    earliest_joining_date = Column(String(50), nullable=True) # e.g. "Immediate" or "2024-06-01"
    notice_period = Column(String(50), nullable=True) # e.g. "Immediate", "15 days", "30 days"
    relocation_preference = Column(String(50), default="Yes", nullable=True) # Yes / No
    target_industries = Column(String(255), nullable=True) # e.g. "Fintech, Cloud Computing, AI"
    target_technologies = Column(String(255), nullable=True) # e.g. "Python, React, AWS"

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="preference")
