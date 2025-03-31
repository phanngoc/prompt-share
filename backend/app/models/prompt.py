from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Prompt(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    content = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    sales_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    # Foreign Keys
    seller_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    
    # Relationships
    seller = relationship("User", back_populates="prompts")
    category = relationship("Category", back_populates="prompts")
    orders = relationship("Order", back_populates="prompt")
    reviews = relationship("Review", back_populates="prompt")
    prompt_usage = relationship("PromptUsage", back_populates="prompt") 