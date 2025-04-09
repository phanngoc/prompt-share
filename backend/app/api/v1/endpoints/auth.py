from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.schemas.token import Token, TokenWithUser, LoginRequest
from app.schemas.user import UserCreate, UserResponse
from app.services import user as user_service

router = APIRouter()

@router.post("/login", response_model=TokenWithUser)
def login(
    login_data: LoginRequest,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    JSON compatible token login, get an access token for future requests
    """
    print('login_data', login_data)
    user = user_service.authenticate_user(
        db, email=login_data.email, password=login_data.password
    )
    print('user', user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Generate tokens
    tokens = security.create_tokens(user)
    
    # Return tokens with user information
    return {
        **tokens,
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified
        }
    }

@router.post("/refresh-token", response_model=Token)
def refresh_token(
    db: Session = Depends(deps.get_db),
    refresh_token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))
) -> Any:
    """
    Refresh access token using refresh token
    """
    # Verify refresh token
    payload = security.verify_token(refresh_token, token_type="refresh")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = user_service.get_user(db, user_id=int(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate new tokens
    return security.create_tokens(user)

@router.post("/register", response_model=TokenWithUser, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Register a new user and return access token
    """
    # Check if email already exists
    user_by_email = user_service.get_user_by_email(db, email=user_data.email)
    if user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Check if username already exists
    if user_data.username:
        user_by_username = user_service.get_user_by_username(db, username=user_data.username)
        if user_by_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this username already exists"
            )
    
    # Create new user
    user = user_service.create_user(db, user_data=user_data)
    
    # Generate tokens
    tokens = security.create_tokens(user)
    
    # Return tokens with user information
    return {
        **tokens,
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified
        }
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get current user information
    """
    return current_user