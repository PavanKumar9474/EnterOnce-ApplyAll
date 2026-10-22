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

    qualification = Column(String(100), nullable=True) # e.g. Bachelors Degree, Masters, High School, Diploma
    degree = Column(String(150), nullable=True)        # e.g. B.Tech, B.E., B.Sc., B.Com., M.Tech, MCA
    major = Column(String(150), nullable=True)         # e.g. Computer Science, Mechanical Eng
    branch = Column(String(150), nullable=True)        # e.g. Information Technology, AI & Data Science
    institution = Column(String(255), nullable=True)   # e.g. Stanford University / Anna University
    college_name = Column(String(255), nullable=True)  # e.g. College of Engineering, Guindy
    start_year = Column(String(20), nullable=True)     # e.g. 2020 or Aug 2020
    graduation_year = Column(String(20), nullable=True) # e.g. 2024 or May 2024
    expected_graduation_date = Column(String(30), nullable=True) # e.g. May 2025
    cgpa = Column(String(20), nullable=True)           # e.g. 3.85 or 8.9
    percentage = Column(String(20), nullable=True)     # e.g. 92%
    grading_scale = Column(String(20), default="10.0", nullable=True)  # e.g. 4.0, 10.0, 100%
    backlogs = Column(String(10), default="0", nullable=True)
    coursework = Column(String(500), nullable=True)    # e.g. Data Structures, Operating Systems, DBMS
    achievements = Column(String(500), nullable=True)  # e.g. Dean's List, Gold Medalist
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="educations")
