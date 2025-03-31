from fastapi import APIRouter
from app.api.v1.endpoints import prompts, admin

api_router = APIRouter()

api_router.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"]) 