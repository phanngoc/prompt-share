from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.prompt import PromptInDB, PromptFilter, PromptCreate, PromptUpdate, PromptResponse
from app.services import prompt as prompt_service
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=PromptResponse)
def list_prompts(
    db: Session = Depends(deps.get_db),
    category_id: int = None,
    min_price: float = None,
    max_price: float = None,
    is_featured: bool = None,
    search: str = None,
    sort_by: str = None,
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 10,
):
    """
    List prompts with filtering, searching, and pagination
    """
    filter_params = PromptFilter(
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        is_featured=is_featured,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )

    prompts, total_count = prompt_service.get_prompts(db, filter_params)
    total_pages = (total_count + page_size - 1) // page_size

    return PromptResponse(
        items=prompts,
        total=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{prompt_id}", response_model=PromptInDB)
def get_prompt(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
):
    """
    Get a single prompt by ID
    """
    prompt = prompt_service.get_prompt(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # Increment view count
    prompt_service.increment_views(db, prompt_id)
    
    return prompt

@router.post("/", response_model=PromptInDB, status_code=status.HTTP_201_CREATED)
def create_prompt(
    prompt_data: PromptCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Create a new prompt
    """
    if current_user.role not in [UserRole.SELLER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sellers can create prompts"
        )
    
    prompt = prompt_service.create_prompt(db, prompt_data, current_user.id)
    return prompt

@router.put("/{prompt_id}", response_model=PromptInDB)
def update_prompt(
    prompt_id: int,
    prompt_data: PromptUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Update a prompt
    """
    prompt = prompt_service.update_prompt(db, prompt_id, prompt_data, current_user.id)
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found or you don't have permission to update it"
        )
    return prompt

@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Delete a prompt (soft delete)
    """
    success = prompt_service.delete_prompt(db, prompt_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found or you don't have permission to delete it"
        )
    return None

@router.get("/user/me", response_model=List[PromptInDB])
def get_my_prompts(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
):
    """
    Get all prompts created by the current user
    """
    if current_user.role not in [UserRole.SELLER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only sellers can view their prompts"
        )
    
    prompts = prompt_service.get_user_prompts(db, current_user.id, skip, limit)
    return prompts 