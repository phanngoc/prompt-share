from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.prompt import Prompt

class UserBase(BaseModel):
    username: str
    full_name: str
    is_top_seller: bool = False

    class Config:
        from_attributes = True

class PromptBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    preview_result: Optional[str] = None
    price: float
    category_id: int
    is_sequence: Optional[bool] = False
    parent_id: Optional[int] = None
    order_index: Optional[int] = 0
    step_content: Optional[str] = None

class PromptCreate(PromptBase):
    pass

class PromptUpdate(PromptBase):
    title: Optional[str] = None
    content: Optional[str] = None
    preview_result: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_sequence: Optional[bool] = None
    parent_id: Optional[int] = None
    order_index: Optional[int] = None
    step_content: Optional[str] = None

class PromptInDB(PromptBase):
    id: int
    seller_id: int
    seller: UserBase
    is_active: bool
    is_featured: bool
    views_count: int
    sales_count: int
    rating: float
    created_at: datetime
    updated_at: datetime
    is_favorited: Optional[bool] = None

    class Config:
        from_attributes = True

class PromptStepBase(BaseModel):
    title: str
    description: Optional[str] = None
    step_content: str
    order_index: int
    parent_id: int

class PromptStepCreate(PromptStepBase):
    pass

class PromptStepInDB(PromptStepBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PromptFilter(BaseModel):
    category_id: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    is_featured: Optional[bool] = None
    is_sequence: Optional[bool] = None
    search: Optional[str] = None
    sort_by: Optional[str] = Field(None, description="Sort by: price, rating, sales, views")
    sort_order: Optional[str] = Field("desc", description="Sort order: asc or desc")
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)

class PromptResponse(BaseModel):
    items: List[PromptInDB]
    total: int
    page: int
    page_size: int
    total_pages: int 