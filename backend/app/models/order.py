from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class Order(Base):
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompt.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    prompt = relationship("Prompt", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False) 