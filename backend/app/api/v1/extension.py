import secrets
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.extension_session import ExtensionSession
from app.services.profile_service import format_profile_for_extension, log_audit

router = APIRouter(prefix="/extension", tags=["Chrome Extension Interface"])


class SessionCreateRequest(BaseModel):
    device_name: Optional[str] = "Chrome Extension"


class AutofillReportRequest(BaseModel):
    url: str
    filledCount: int
    skippedCount: int
    preservedCount: int
    timestamp: Optional[str] = None


@router.post("/session")
def create_extension_session(
    req: SessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a dedicated long-lived token for the Chrome Extension.
    Users can copy this token from the Web App and paste it into the extension popup.
    """
    token_str = "ao_ext_" + secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=90)

    session = ExtensionSession(
        user_id=current_user.id,
        session_token=token_str,
        device_name=req.device_name,
        expires_at=expires_at,
        is_revoked=False
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    log_audit(db, current_user.id, "EXTENSION_TOKEN_CREATED", f"Device: {req.device_name}")

    return {
        "token": token_str,
        "device_name": req.device_name,
        "expires_at": expires_at.isoformat()
    }


@router.get("/profile")
def get_extension_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns candidate profile in the hierarchical schema expected by the ApplyOnce autofill engine.
    """
    if not current_user.profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No candidate profile exists for this account. Please complete your profile first."
        )

    log_audit(db, current_user.id, "EXTENSION_PROFILE_FETCHED", "Extension synced candidate profile.")
    return format_profile_for_extension(current_user.profile)


@router.post("/autofill-report")
def receive_autofill_report(
    report: AutofillReportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Receives autofill execution telemetry from the extension content script.
    """
    details = f"URL: {report.url} | Filled: {report.filledCount} | Preserved: {report.preservedCount} | Skipped: {report.skippedCount}"
    log_audit(db, current_user.id, "AUTOFILL_EXECUTED", details)

    from app.services.profile_service import dispatch_n8n_event
    dispatch_n8n_event("APPLICATION_TRACKED", {
        "user_id": current_user.id,
        "url": report.url,
        "filled_count": report.filledCount,
        "skipped_count": report.skippedCount,
        "timestamp": report.timestamp or datetime.now(timezone.utc).isoformat()
    })

    return {"status": "ok"}

