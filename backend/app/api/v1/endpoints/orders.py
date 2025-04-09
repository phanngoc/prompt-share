from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.services import order as order_service
from app.schemas.order import OrderCreate, OrderResponse, OrderDetailResponse, PaymentCreate
from app.models.user import User
from app.models.enums import OrderStatus
from app.models.payment import PaymentStatus

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    *,
    db: Session = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create new order.
    """
    order = order_service.create_order(db=db, order_data=order_in, user_id=current_user.id)
    return order

@router.post("/{order_id}/payments", status_code=status.HTTP_201_CREATED)
def create_payment_for_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    payment_in: PaymentCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create payment for an order.
    """
    # Check if order exists and belongs to the current user
    order = order_service.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this order"
        )
        
    payment = order_service.create_payment(db=db, payment_data=payment_in, order_id=order_id)
    return {"message": "Payment initiated", "payment_id": payment.id, "transaction_id": payment.transaction_id}

@router.get("/", response_model=List[OrderResponse])
def read_orders(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve orders for the current user.
    """
    orders = order_service.get_orders_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return orders

@router.get("/{order_id}", response_model=dict)
def read_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get specific order by ID with detailed information.
    """
    order = order_service.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Only allow user to see their own orders (or admins)
    if order.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Get detailed order information
    order_details = order_service.get_order_with_details(db=db, order_id=order_id)
    return order_details

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    status: OrderStatus,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update order status. Only admins can update status.
    """
    # Check if user is an admin
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update order status"
        )
    
    order = order_service.update_order_status(db=db, order_id=order_id, status=status)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order

@router.patch("/payments/{payment_id}/status")
def update_payment_status(
    *,
    db: Session = Depends(get_db),
    payment_id: int,
    status: PaymentStatus,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update payment status. Only admins can update status or a webhook can call this endpoint.
    """
    # Check if user is an admin
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update payment status"
        )
    
    payment = order_service.update_payment_status(db=db, payment_id=payment_id, status=status)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    return {"message": "Payment status updated", "status": status}