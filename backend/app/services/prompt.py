from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, desc, asc
from app.models.prompt import Prompt
from app.schemas.prompt import PromptFilter, PromptCreate, PromptUpdate

def get_prompts(
    db: Session,
    filter_params: PromptFilter,
    user_id: Optional[int] = None,
) -> tuple[List[Prompt], int]:
    """
    Get prompts with filtering, searching, and pagination
    Returns tuple of (prompts, total_count)
    """
    query = db.query(Prompt).options(joinedload(Prompt.seller)).filter(Prompt.is_active == True)

    # Apply filters
    if filter_params.category_id:
        query = query.filter(Prompt.category_id == filter_params.category_id)
    
    if filter_params.min_price is not None:
        query = query.filter(Prompt.price >= filter_params.min_price)
    
    if filter_params.max_price is not None:
        query = query.filter(Prompt.price <= filter_params.max_price)
    
    if filter_params.is_featured is not None:
        query = query.filter(Prompt.is_featured == filter_params.is_featured)
    
    # Apply search
    if filter_params.search:
        search_term = f"%{filter_params.search}%"
        query = query.filter(
            or_(
                Prompt.title.ilike(search_term),
                Prompt.description.ilike(search_term),
                Prompt.content.ilike(search_term)
            )
        )

    # Apply sorting
    if filter_params.sort_by:
        sort_column = getattr(Prompt, filter_params.sort_by, Prompt.created_at)
        if filter_params.sort_order == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))
    else:
        # Default sorting by created_at desc
        query = query.order_by(desc(Prompt.created_at))

    # Get total count before pagination
    total_count = query.count()

    # Apply pagination
    query = query.offset((filter_params.page - 1) * filter_params.page_size)
    query = query.limit(filter_params.page_size)

    prompts = query.all()
    
    # If user_id is provided, check which prompts are favorited by the user
    if user_id and prompts:
        from app.services.favorite import is_favorited
        for prompt in prompts:
            prompt.is_favorited = is_favorited(db, user_id, prompt.id)
    
    return prompts, total_count

def get_prompt(db: Session, prompt_id: int, user_id: Optional[int] = None) -> Optional[Prompt]:
    """Get a single prompt by ID"""
    prompt = db.query(Prompt).options(joinedload(Prompt.seller)).filter(Prompt.id == prompt_id).first()
    
    # If user_id is provided, check if the prompt is favorited by the user
    if prompt and user_id:
        from app.services.favorite import is_favorited
        prompt.is_favorited = is_favorited(db, user_id, prompt_id)
    
    return prompt

def increment_views(db: Session, prompt_id: int) -> None:
    """Increment the views count of a prompt"""
    prompt = get_prompt(db, prompt_id)
    if prompt:
        prompt.views_count += 1
        db.commit()

def create_prompt(
    db: Session,
    prompt_data: PromptCreate,
    seller_id: int,
) -> Prompt:
    """Create a new prompt"""
    db_prompt = Prompt(
        **prompt_data.dict(),
        seller_id=seller_id,
        is_active=True,
        is_featured=False,
        views_count=0,
        sales_count=0,
        rating=0.0,
    )
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

def update_prompt(
    db: Session,
    prompt_id: int,
    prompt_data: PromptUpdate,
    seller_id: int,
) -> Optional[Prompt]:
    """Update a prompt"""
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        return None
    
    # Check if user owns the prompt
    if prompt.seller_id != seller_id:
        return None
    
    update_data = prompt_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prompt, field, value)
    
    db.commit()
    db.refresh(prompt)
    return prompt

def delete_prompt(
    db: Session,
    prompt_id: int,
    seller_id: int,
) -> bool:
    """Soft delete a prompt"""
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        return False
    
    # Check if user owns the prompt
    if prompt.seller_id != seller_id:
        return False
    
    prompt.is_active = False
    db.commit()
    return True

def get_user_prompts(
    db: Session,
    seller_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[Prompt]:
    """Get all prompts created by a user"""
    return (
        db.query(Prompt)
        .options(joinedload(Prompt.seller))
        .filter(Prompt.seller_id == seller_id)
        .offset(skip)
        .limit(limit)
        .all()
    ) 