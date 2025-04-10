from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.review import Review
from app.models.order import Order
from app.models.prompt import Prompt
from app.schemas.review import ReviewCreate, ReviewUpdate
from app.models.enums import OrderStatus


def has_purchased_prompt(db: Session, user_id: int, prompt_id: int) -> bool:
    """
    Check if a user has purchased a prompt (has a completed order)
    """
    order = db.query(Order).filter(
        Order.user_id == user_id,
        Order.prompt_id == prompt_id,
        Order.status == OrderStatus.COMPLETED
    ).first()
    
    return order is not None


def get_reviews_for_prompt(db: Session, prompt_id: int, skip: int = 0, limit: int = 100) -> List[Review]:
    """
    Get all reviews for a specific prompt
    """
    return db.query(Review).filter(Review.prompt_id == prompt_id).offset(skip).limit(limit).all()


def get_user_review_for_prompt(db: Session, user_id: int, prompt_id: int) -> Optional[Review]:
    """
    Get a specific user's review for a prompt
    """
    return db.query(Review).filter(
        Review.user_id == user_id,
        Review.prompt_id == prompt_id
    ).first()


def create_review(db: Session, review: ReviewCreate, user_id: int) -> Review:
    """
    Create a new review for a prompt
    """
    # Verify prompt exists
    prompt = db.query(Prompt).filter(Prompt.id == review.prompt_id).first()
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    # Verify user has purchased the prompt
    if not has_purchased_prompt(db, user_id, review.prompt_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review prompts you have purchased"
        )
    
    # Check if user already has a review for this prompt
    existing_review = get_user_review_for_prompt(db, user_id, review.prompt_id)
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this prompt"
        )
    
    # Create new review
    db_review = Review(
        **review.dict(),
        user_id=user_id
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update prompt's average rating
    update_prompt_rating(db, review.prompt_id)
    
    return db_review


def update_review(db: Session, review_id: int, review_update: ReviewUpdate, user_id: int) -> Optional[Review]:
    """
    Update an existing review
    """
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        return None
    
    # Check if the review belongs to the user
    if db_review.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this review"
        )
    
    update_data = review_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_review, field, value)
    
    db.commit()
    db.refresh(db_review)
    
    # Update prompt's average rating
    update_prompt_rating(db, db_review.prompt_id)
    
    return db_review


def delete_review(db: Session, review_id: int, user_id: int) -> bool:
    """
    Delete a review
    """
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        return False
    
    # Check if the review belongs to the user
    if db_review.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You don't have permission to delete this review"
        )
    
    prompt_id = db_review.prompt_id
    
    db.delete(db_review)
    db.commit()
    
    # Update prompt's average rating
    update_prompt_rating(db, prompt_id)
    
    return True


def update_prompt_rating(db: Session, prompt_id: int) -> None:
    """
    Update a prompt's average rating based on its reviews
    """
    # Get all reviews for this prompt
    reviews = db.query(Review).filter(Review.prompt_id == prompt_id).all()
    
    if not reviews:
        # If no reviews, set rating to 0
        prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if prompt:
            prompt.rating = 0.0
            db.commit()
        return
    
    # Calculate average rating
    total_rating = sum(review.rating for review in reviews)
    avg_rating = total_rating / len(reviews)
    
    # Update prompt rating
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if prompt:
        prompt.rating = avg_rating
        db.commit()
