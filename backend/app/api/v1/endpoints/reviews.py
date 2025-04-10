from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.review import ReviewInDB, ReviewCreate, ReviewUpdate, ReviewWithUser
from app.services import review as review_service

router = APIRouter()


@router.get("/prompt/{prompt_id}", response_model=List[ReviewWithUser])
def get_prompt_reviews(
    prompt_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """
    Get all reviews for a specific prompt
    """
    return review_service.get_reviews_for_prompt(db, prompt_id, skip, limit)


@router.get("/user/me/prompt/{prompt_id}", response_model=ReviewInDB)
def get_my_review_for_prompt(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Get the current user's review for a specific prompt
    """
    review = review_service.get_user_review_for_prompt(db, current_user.id, prompt_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    return review


@router.post("/", response_model=ReviewInDB, status_code=status.HTTP_201_CREATED)
def create_review(
    review_data: ReviewCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Create a new review for a prompt
    """
    return review_service.create_review(db, review_data, current_user.id)


@router.put("/{review_id}", response_model=ReviewInDB)
def update_review(
    review_id: int,
    review_data: ReviewUpdate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Update an existing review
    """
    updated_review = review_service.update_review(db, review_id, review_data, current_user.id)
    if not updated_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    return updated_review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Delete a review
    """
    success = review_service.delete_review(db, review_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    return None


@router.get("/check-purchase/{prompt_id}", response_model=bool)
def check_has_purchased(
    prompt_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Check if the current user has purchased a specific prompt
    """
    return review_service.has_purchased_prompt(db, current_user.id, prompt_id)
