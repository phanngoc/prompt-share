from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
from app.models.enums import OrderStatus

class Order(Base):
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = Column(Text, nullable=True)  # Additional notes about the order
    
    # For SOL payments
    sol_amount = Column(Float, nullable=True)  # Amount in SOL if applicable
    payment_type = Column(String, default="fiat")  # "fiat" or "sol"
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompt.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    prompt = relationship("Prompt", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False)