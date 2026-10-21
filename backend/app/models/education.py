from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class EducationRecord(Base):
    __tablename__ = "education_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    qualification = Column(String(100), nullable=True) # e.g. Bachelors Degree, Masters, High School
    degree = Column(String(150), nullable=True)        # e.g. Bachelor of Science, B.Tech
    major = Column(String(150), nullable=True)         # e.g. Computer Science, Mechanical Eng
    institution = Column(String(255), nullable=True)   # e.g. Stanford University
    graduation_year = Column(String(10), nullable=True) # e.g. 2024
    cgpa = Column(String(20), nullable=True)           # e.g. 3.85
    percentage = Column(String(20), nullable=True)     # e.g. 92%
    grading_scale = Column(String(20), nullable=True)  # e.g. 4.0, 10.0
    backlogs = Column(String(10), default="0", nullable=True)
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="educations")
