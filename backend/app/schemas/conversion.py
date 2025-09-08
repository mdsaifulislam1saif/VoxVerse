from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Shared fields
class ConversionBase(BaseModel):
    file_name: Optional[str] = Field(None, example="document.pdf")
    language: Optional[str] = Field(None, example="en")
    source_type: str = Field(..., description="Type of source: 'pdf', 'image', or 'text'")
    text_content: Optional[str] = Field(None, description="If user directly inputs text")

# Create schema (for POST requests)
class ConversionCreate(ConversionBase):
    pass

# Update schema (for PATCH/PUT requests)
class ConversionUpdate(BaseModel):
    file_name: Optional[str] = None
    language: Optional[str] = None
    text_content: Optional[str] = None

# Base schema for DB responses
class ConversionInDBBase(ConversionBase):
    id: int
    user_id: int
    audio_file_path: str
    created_at: datetime

    class Config:
        from_attributes = True  # works with SQLAlchemy ORM

# Schema for API response
class Conversion(ConversionInDBBase):
    pass

# Schema for internal DB operations
class ConversionInDB(ConversionInDBBase):
    pass

# Schema for text-to-speech requests
class TextToSpeechRequest(BaseModel):
    text: str = Field(..., example="Hello world")
    language: str = Field("en", example="en")
    speaker: Optional[str] = Field(None, description="Optional speaker ID or name")
