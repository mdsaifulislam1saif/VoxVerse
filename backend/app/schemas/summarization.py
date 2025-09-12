from typing import Literal
from pydantic import BaseModel, Field, validator

# Request schema
class TextSummarizationRequest(BaseModel):
    """Schema for text summarization request."""
    text: str
    language: str
    summary_type: Literal["brief", "detailed", "bullet_points"]  # enforce valid types

# Response schema
class SummarizationResponse(BaseModel):
    """Schema for summarization response."""   
    original_content: str
    summary_content: str
    language: str
    summary_type: Literal["brief", "detailed", "bullet_points"]