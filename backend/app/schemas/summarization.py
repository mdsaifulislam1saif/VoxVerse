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
    
    @validator('text')
    def validate_text_content(cls, v):
        if not v or not v.strip():
            raise ValueError('Text content cannot be empty')
        return v.strip()
    
    @validator('language')
    def validate_language(cls, v):
        # List of supported language codes
        supported_languages = [
            'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 
            'zh', 'ar', 'hi', 'bn', 'nl', 'sv', 'da', 'no', 'fi'
        ]
        if v not in supported_languages:
            raise ValueError(f'Language must be one of: {", ".join(supported_languages)}')
        return v

class SummarizationResponse(BaseModel):
    """Schema for summarization response."""
    file_name: str
    language: str
    source_type: Literal["pdf", "image", "text"]
    original_content: str
    summary_content: str
    summary_type: Literal["brief", "detailed", "bullet_points"]
    audio_file_path: str
    audio_file_name: str = None
    
    def __init__(self, **data):
        super().__init__(**data)
        # Extract just the filename from the full path
        if self.audio_file_path:
            import os
            self.audio_file_name = os.path.basename(self.audio_file_path)