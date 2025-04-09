from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User
from app.services import user as user_service

# Fix typo: OAuth2PassordBearer -> OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

# Add HTTP Bearer for JSON requests
http_bearer = HTTPBearer(auto_error=False)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_token_from_header(credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer)) -> Optional[str]:
    """Extract token from Authorization header"""
    if credentials:
        return credentials.credentials
    return None

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    header_token: Optional[str] = Depends(get_token_from_header)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Use token from header if provided, otherwise use the one from oauth2_scheme
    final_token = header_token or token
    
    # Check if token is None (happens when auto_error=False)
    if final_token is None:
        raise credentials_exception
        
    try:
        payload = jwt.decode(
            final_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = user_service.get_user(db, user_id=int(user_id))
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_user_optional(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    if not token:
        return None
    
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        
        user = user_service.get_user(db, user_id=int(user_id))
        if user is None or not user.is_active:
            return None
        
        return user
    except JWTError:
        return None