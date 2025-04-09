from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import OrderStatus

class OrderBase(BaseModel):
    amount: float
    prompt_id: int
    payment_type: str = Field(default="fiat", description="Payment type: 'fiat' or 'sol'")
    sol_amount: Optional[float] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class PaymentCreate(BaseModel):
    method: str
    payment_details: Optional[str] = None
    wallet_address: Optional[str] = None  # For SOL payments
    blockchain_tx_id: Optional[str] = None  # For SOL payments

class OrderWithPayment(BaseModel):
    order: OrderBase
    payment: PaymentCreate

class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: OrderStatus
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class OrderDetailResponse(OrderResponse):
    prompt_title: str = None  # Will be filled in by the service
    prompt_description: str = None  # Will be filled in by the service
    user_email: str = None  # Will be filled in by the service

    class Config:
        orm_mode = True