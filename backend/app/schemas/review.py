from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ReviewBase(BaseModel):
    rating: float = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    prompt_id: int


class ReviewUpdate(ReviewBase):
    pass


class ReviewInDBBase(ReviewBase):
    id: int
    user_id: int
    prompt_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class ReviewInDB(ReviewInDBBase):
    pass


class ReviewWithUser(ReviewInDBBase):
    user_username: str
    user_full_name: str
