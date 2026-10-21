from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.profile import router as profile_router
from app.api.v1.resumes import router as resumes_router
from app.api.v1.extension import router as extension_router
from app.api.v1.account import router as account_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(profile_router)
api_router.include_router(resumes_router)
api_router.include_router(extension_router)
api_router.include_router(account_router)
