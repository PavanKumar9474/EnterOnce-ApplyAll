from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class SavedAnswerRecord(Base):
    __tablename__ = "saved_answer_records"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    question_key = Column(String(100), index=True, nullable=False) # e.g. "work_auth", "notice_period", "why_hire_you", "ibm_joining"
    question_text = Column(String(500), nullable=False) # The actual label or question text
    answer = Column(Text, nullable=False) # The user-provided or confirmed answer
    company = Column(String(100), nullable=True) # None/empty for universal, or company name like "IBM", "Capgemini", "TCS"
    input_type = Column(String(50), default="text", nullable=False) # text, select, radio, date, number, textarea
    category = Column(String(100), default="General", nullable=False) # General, Technical, Relocation & Visa, Compensation, Company-Specific, Behavioral
    requires_confirmation = Column(Integer, default=0, nullable=False) # 1 if sensitive (salary, legal status) requiring manual confirmation before autofill

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    profile = relationship("CandidateProfile", back_populates="saved_answers")
