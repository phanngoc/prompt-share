from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base

class PaymentMethod(str, enum.Enum):
    MOMO = "momo"
    ZALOPAY = "zalopay"
    VNPAY = "vnpay"
    STRIPE = "stripe"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class Payment(Base):
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    method = Column(Enum(PaymentMethod), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_details = Column(String)  # JSON string of payment details
    
    # Foreign Keys
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False, unique=True)
    
    # Relationships
    order = relationship("Order", back_populates="payment") 