from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.category import CategoryInDB
from app.services import category as category_service

router = APIRouter()

@router.get("/", response_model=List[CategoryInDB])
def list_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    List all active categories with pagination.
    This endpoint is available to all users without authentication.
    """
    categories = category_service.get_categories(db, skip, limit)
    
    # Add prompts count to each category
    for category in categories:
        category.prompts_count = category_service.get_category_prompts_count(db, category.id)
    
    return categories


@router.get("/{category_id}", response_model=CategoryInDB)
def get_category(
    category_id: int,
    db: Session = Depends(deps.get_db),
):
    """
    Get a single category by ID.
    This endpoint is available to all users without authentication.
    """
    category = category_service.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category.prompts_count = category_service.get_category_prompts_count(db, category_id)
    return category