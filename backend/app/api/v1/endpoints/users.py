from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User, UserRole
from app.schemas.user import UserUpdate
from app.services import user as user_service

router = APIRouter()


@router.get("/{user_id}/wallet", response_model=dict)
def get_user_wallet(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_user),
) -> Any:
    """
    Get a user's wallet address
    """
    # Check if the user exists
    user = user_service.get_user(db, user_id=user_id)
    print('user', user_id, user.wallet_address)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return the wallet address
    return {"wallet_address": user.wallet_address}


@router.put("/{user_id}/wallet", response_model=dict)
def update_user_wallet(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
    wallet_data: dict = Body(...),
) -> Any:
    """
    Update a user's wallet address
    """
    # Check if the current user is updating their own wallet or is an admin
    if current_user.id != user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if the user exists
    user = user_service.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Extract wallet_address from request body
    wallet_address = wallet_data.get("wallet_address")
    if not wallet_address:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="wallet_address field is required"
        )
    
    # Update the wallet address
    user.wallet_address = wallet_address
    db.commit()
    
    return {"success": True, "wallet_address": wallet_address}
