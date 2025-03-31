from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base

class Category(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    slug = Column(String, unique=True, index=True, nullable=False)
    
    # Relationships
    prompts = relationship("Prompt", back_populates="category") 