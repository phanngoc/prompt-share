from enum import Enum
from sqlalchemy import Boolean, Column, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.db.base import Base

class UserRole(str, Enum):
    USER = "user"
    SELLER = "seller"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False)
    wallet_address = Column(String, nullable=True)
    
    # Relationships
    prompts = relationship("Prompt", back_populates="seller")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    prompt_usage = relationship("PromptUsage", back_populates="user")
    favorites = relationship("Favorite", back_populates="user") 