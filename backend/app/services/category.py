from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

def get_categories(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> List[Category]:
    """Get all categories with pagination"""
    return (
        db.query(Category)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_category(db: Session, category_id: int) -> Optional[Category]:
    """Get a single category by ID"""
    return (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

def create_category(
    db: Session,
    category_data: CategoryCreate,
) -> Category:
    """Create a new category"""
    db_category = Category(**category_data.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(
    db: Session,
    category_id: int,
    category_data: CategoryUpdate,
) -> Optional[Category]:
    """Update a category"""
    category = get_category(db, category_id)
    if not category:
        return None
    
    update_data = category_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    return category

def delete_category(
    db: Session,
    category_id: int,
) -> bool:
    """Delete a category"""
    category = get_category(db, category_id)
    if not category:
        return False
    
    db.delete(category)
    db.commit()
    return True

def get_category_prompts_count(db: Session, category_id: int) -> int:
    """Get the number of prompts in a category"""
    from app.models.prompt import Prompt
    return (
        db.query(Prompt)
        .filter(Prompt.category_id == category_id)
        .count()
    )