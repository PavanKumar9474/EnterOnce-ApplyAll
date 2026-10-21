from typing import Generator, Optional
from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User
from app.models.extension_session import ExtensionSession

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False
)


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> User:
    """
    Validates JWT access token or Extension Session token and returns authenticated user.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 1. Try decoding as JWT
    payload = decode_token(token)
    if payload and "sub" in payload:
        user_id = payload["sub"]
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user and user.is_active:
            return user

    # 2. Try looking up as an Extension Session token
    ext_session = db.query(ExtensionSession).filter(
        ExtensionSession.session_token == token,
        ExtensionSession.is_revoked == False
    ).first()

    if ext_session:
        # Check expiration handling both timezone-aware and naive timestamps (e.g. in SQLite)
        now = datetime.now(timezone.utc)
        expires_at = ext_session.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at > now:
            ext_session.last_used_at = now
            db.commit()
            user = db.query(User).filter(User.id == ext_session.user_id).first()
            if user and user.is_active:
                return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account.")
    return current_user
