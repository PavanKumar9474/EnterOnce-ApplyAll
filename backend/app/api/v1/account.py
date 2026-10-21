import os
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.resume import ResumeRecord
from app.services.profile_service import format_profile_for_extension

router = APIRouter(prefix="/account", tags=["Account & Privacy"])


@router.get("/export")
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Exports all personal candidate data, resumes metadata, and audit events in a portable JSON format.
    """
    profile_data = format_profile_for_extension(current_user.profile) if current_user.profile else {}

    resumes_data = []
    for r in current_user.resumes:
        resumes_data.append({
            "id": r.id,
            "filename": r.filename,
            "file_size": r.file_size,
            "mime_type": r.mime_type,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })

    audit_events = []
    for log in current_user.audit_logs:
        audit_events.append({
            "event_type": log.event_type,
            "details": log.details,
            "timestamp": log.created_at.isoformat() if log.created_at else None
        })

    return {
        "applyonce_export_version": "1.0",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None
        },
        "candidate_profile": profile_data,
        "resumes": resumes_data,
        "audit_logs": audit_events
    }


@router.delete("", status_code=status.HTTP_200_OK)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently deletes user account, candidate profile, resumes, and audit history.
    """
    # Delete uploaded resume physical files
    for r in current_user.resumes:
        if r.file_path and os.path.exists(r.file_path):
            try:
                os.remove(r.file_path)
            except OSError:
                pass

    # Cascade deletes profile, educations, experiences, skills, projects, sessions, audit_logs
    db.delete(current_user)
    db.commit()

    return {"message": "Account and all associated candidate profile data have been permanently deleted."}
