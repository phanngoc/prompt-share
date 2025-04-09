from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base import Base

class PaymentMethod(str, enum.Enum):
    MOMO = "momo"
    ZALOPAY = "zalopay"
    VNPAY = "vnpay"
    STRIPE = "stripe"
    SOL = "sol"  # Adding SOL payment method

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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # For SOL payments
    sol_amount = Column(Float, nullable=True)  # Amount in SOL
    wallet_address = Column(String, nullable=True)  # Receiver's wallet address
    blockchain_tx_id = Column(String, nullable=True)  # Blockchain transaction ID
    
    # Foreign Keys
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False, unique=True)
    
    # Relationships
    order = relationship("Order", back_populates="payment")