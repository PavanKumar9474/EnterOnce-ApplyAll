from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # Personal info
    first_name = Column(String(100), nullable=True)
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(30), nullable=True)
    country = Column(String(100), nullable=True)

    # Online profiles
    linkedin = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)
    portfolio = Column(String(255), nullable=True)

    # Preferences & work eligibility
    notice_period = Column(String(50), nullable=True)
    work_authorization = Column(String(50), nullable=True)
    willingness_to_relocate = Column(String(50), nullable=True)
    preferred_location = Column(String(255), nullable=True)
    experience_years = Column(String(30), nullable=True)
    bio = Column(Text, nullable=True)

    # Verification state: 'User Verified', 'Extracted', 'Needs Review', 'Conflicting Information'
    verification_status = Column(String(50), default="User Verified", nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="profile")
    educations = relationship("EducationRecord", back_populates="profile", cascade="all, delete-orphan")
    experiences = relationship("ExperienceRecord", back_populates="profile", cascade="all, delete-orphan")
    skills = relationship("SkillRecord", back_populates="profile", cascade="all, delete-orphan")
    projects = relationship("ProjectRecord", back_populates="profile", cascade="all, delete-orphan")
