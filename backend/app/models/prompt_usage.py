from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class PromptUsage(Base):
    id = Column(Integer, primary_key=True, index=True)
    usage_date = Column(DateTime, default=datetime.utcnow)
    input_text = Column(Text)
    output_text = Column(Text)
    success = Column(Boolean, default=True)
    error_message = Column(Text)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    prompt_id = Column(Integer, ForeignKey("prompt.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="prompt_usage")
    prompt = relationship("Prompt", back_populates="prompt_usage") 