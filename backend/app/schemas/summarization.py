from typing import Literal
from pydantic import BaseModel, Field, validator

class TextSummarizationRequest(BaseModel):
    """Schema for text summarization request."""
    text: str = Field(..., min_length=10, max_length=50000, description="Text content to summarize")
    language: str = Field("en", description="Language code (e.g., 'en', 'es', 'fr')")
    summary_type: Literal["brief", "detailed", "bullet_points"] = Field(
        "brief", 
        description="Type of summary: brief (2-3 sentences), detailed (comprehensive), or bullet_points (organized list)"
    )

class SummarizationResponse(BaseModel):
    """Schema for summarization response."""
    file_name: str
    language: str
    source_type: Literal["pdf", "image", "text"]
    original_content: str
    summary_content: str
    summary_type: Literal["brief", "detailed", "bullet_points"]

    
