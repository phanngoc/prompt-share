from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base import Base

class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    PENDING = "pending"

class Subscription(Base):
    id = Column(Integer, primary_key=True, index=True)
    plan = Column(Enum(SubscriptionPlan), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.PENDING)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    auto_renew = Column(Boolean, default=True)
    price = Column(Float, nullable=False)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="subscriptions") 