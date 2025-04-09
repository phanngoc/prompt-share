from typing import Optional
from pydantic import BaseModel
from app.models.user import UserRole
from datetime import datetime

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    exp: Optional[datetime] = None
    iat: Optional[datetime] = None
    role: Optional[UserRole] = None
    email: Optional[str] = None
    
class UserInfo(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    role: UserRole
    is_active: bool
    is_verified: bool

class TokenWithUser(Token):
    user: UserInfo

class LoginRequest(BaseModel):
    email: str
    password: str