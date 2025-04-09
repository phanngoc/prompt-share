from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.prompt import PromptInDB
from app.schemas.favorite import FavoriteCreate, FavoriteResponse
from app.services import favorite as favorite_service
from app.services import prompt as prompt_service

router = APIRouter()


@router.post("/{prompt_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Add a prompt to favorites
    """
    # Check if prompt exists
    prompt = prompt_service.get_prompt(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    favorite = favorite_service.add_favorite(db, current_user.id, prompt_id)
    return {"success": True, "message": "Prompt added to favorites"}


@router.delete("/{prompt_id}", status_code=status.HTTP_200_OK)
def remove_favorite(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Remove a prompt from favorites
    """
    success = favorite_service.remove_favorite(db, current_user.id, prompt_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found in favorites"
        )
    
    return {"success": True, "message": "Prompt removed from favorites"}


@router.get("/", response_model=List[PromptInDB])
def get_my_favorites(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
):
    """
    Get all prompts favorited by the current user
    """
    favorites = favorite_service.get_user_favorites(db, current_user.id, skip, limit)
    return favorites


@router.get("/check/{prompt_id}", status_code=status.HTTP_200_OK)
def check_favorite(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Check if a prompt is in the user's favorites
    """
    is_favorited = favorite_service.is_favorited(db, current_user.id, prompt_id)
    return {"is_favorited": is_favorited}
