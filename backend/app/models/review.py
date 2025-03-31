from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Review(Base):
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompt.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    prompt = relationship("Prompt", back_populates="reviews") 