from typing import Optional
from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = Field(None, max_length=50)

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = Field(None, max_length=50)

class CategoryInDB(CategoryBase):
    id: int
    is_active: bool
    prompts_count: Optional[int] = None

    class Config:
        orm_mode = True 