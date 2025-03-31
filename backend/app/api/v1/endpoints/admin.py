from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.category import CategoryInDB, CategoryCreate, CategoryUpdate
from app.services import category as category_service
from app.models.user import UserRole

router = APIRouter()

@router.get("/categories", response_model=List[CategoryInDB])
def list_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
):
    """
    List all categories with pagination (admin only)
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access this endpoint"
        )
    
    categories = category_service.get_categories(db, skip, limit)
    # Add prompts count to each category
    for category in categories:
        category.prompts_count = category_service.get_category_prompts_count(db, category.id)
    return categories

@router.get("/categories/{category_id}", response_model=CategoryInDB)
def get_category(
    category_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Get a single category by ID (admin only)
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access this endpoint"
        )
    
    category = category_service.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category.prompts_count = category_service.get_category_prompts_count(db, category_id)
    return category

@router.post("/categories", response_model=CategoryInDB, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Create a new category (admin only)
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create categories"
        )
    
    category = category_service.create_category(db, category_data)
    return category

@router.put("/categories/{category_id}", response_model=CategoryInDB)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Update a category (admin only)
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update categories"
        )
    
    category = category_service.update_category(db, category_id, category_data)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Delete a category (admin only)
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete categories"
        )
    
    success = category_service.delete_category(db, category_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return None 