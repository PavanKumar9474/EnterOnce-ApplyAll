from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.models.user import User
from app.models.profile import CandidateProfile
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.profile_service import log_audit

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Registers a new user and creates an associated candidate profile."""
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_active=True
    )
    db.add(user)
    db.flush()

    # Create empty candidate profile
    profile = CandidateProfile(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        verification_status="Extracted"
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    log_audit(db, user.id, "REGISTER", f"Account created for {user.email}")
    return user


@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user with email & password, returning a signed JWT access token."""
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is disabled.")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=user.id,
        expires_delta=access_token_expires
    )

    log_audit(db, user.id, "LOGIN", f"Successful login for {user.email}")

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Records logout event."""
    log_audit(db, current_user.id, "LOGOUT", "User logged out.")
    return {"message": "Logged out successfully."}


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Returns current authenticated user details."""
    profile_id = current_user.profile.id if current_user.profile else None
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "profile_id": profile_id,
        "created_at": current_user.created_at
    }
