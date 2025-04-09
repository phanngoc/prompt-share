from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Favorite(Base):
    __tablename__ = "favorite"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompt.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    prompt = relationship("Prompt", back_populates="favorites")
