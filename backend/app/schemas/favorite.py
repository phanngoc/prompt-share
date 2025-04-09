from pydantic import BaseModel
from typing import List, Optional


class FavoriteBase(BaseModel):
    prompt_id: int


class FavoriteCreate(FavoriteBase):
    pass


class FavoriteInDB(FavoriteBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class FavoriteResponse(BaseModel):
    items: List[FavoriteInDB]
    total: int
    page: int
    page_size: int
    total_pages: int
