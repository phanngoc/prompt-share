from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.favorite import Favorite
from app.models.prompt import Prompt


def add_favorite(db: Session, user_id: int, prompt_id: int) -> Favorite:
    """Add a prompt to a user's favorites"""
    # Check if already favorited
    existing = db.query(Favorite).filter(
        and_(Favorite.user_id == user_id, Favorite.prompt_id == prompt_id)
    ).first()
    
    if existing:
        return existing
    
    # Create new favorite
    db_favorite = Favorite(user_id=user_id, prompt_id=prompt_id)
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite


def remove_favorite(db: Session, user_id: int, prompt_id: int) -> bool:
    """Remove a prompt from a user's favorites"""
    favorite = db.query(Favorite).filter(
        and_(Favorite.user_id == user_id, Favorite.prompt_id == prompt_id)
    ).first()
    
    if not favorite:
        return False
    
    db.delete(favorite)
    db.commit()
    return True


def get_user_favorites(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[Prompt]:
    """Get all prompts that a user has favorited"""
    favorites = (
        db.query(Prompt)
        .join(Favorite, Favorite.prompt_id == Prompt.id)
        .filter(Favorite.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return favorites


def is_favorited(db: Session, user_id: int, prompt_id: int) -> bool:
    """Check if a prompt is favorited by a user"""
    favorite = db.query(Favorite).filter(
        and_(Favorite.user_id == user_id, Favorite.prompt_id == prompt_id)
    ).first()
    
    return favorite is not None


def count_favorites(db: Session, prompt_id: int) -> int:
    """Count the number of users who have favorited a prompt"""
    return db.query(Favorite).filter(Favorite.prompt_id == prompt_id).count()
