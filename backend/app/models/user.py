from sqlalchemy import Boolean, Column, Integer, String, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    SELLER = "seller"

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Relationships
    prompts = relationship("Prompt", back_populates="seller")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    prompt_usage = relationship("PromptUsage", back_populates="user") 