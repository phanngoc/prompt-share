from fastapi import APIRouter
from app.api.v1.endpoints import prompts, admin, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"]) 