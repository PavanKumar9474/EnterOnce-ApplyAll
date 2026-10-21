from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)

    event_type = Column(String(100), nullable=False) # e.g. LOGIN, AUTOFILL_EXECUTED, PROFILE_UPDATED, RESUME_UPLOADED
    details = Column(Text, nullable=True) # JSON or descriptive string
    ip_address = Column(String(50), nullable=True)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    user = relationship("User", back_populates="audit_logs")
