import os
import asyncio
from pathlib import Path
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from app.models.user import User
from app.models.conversion import Conversion
from app.crud.conversion import conversion as conversion_crud
from app.config.config import settings
from app.schemas.conversion import TextToSpeechRequest
from app.services.ocr_service import OCRProcessor
from app.services.tts_service import TTSProcessor

class ConversionService:
    """Service class to handle conversion-related operations."""
    def __init__(self, db: Session, current_user: User):
        self.db = db
        self.current_user = current_user
        self.ocr = OCRProcessor()
        self.tts = TTSProcessor()

    async def convert_text(self, request: TextToSpeechRequest) -> Conversion:
        """Convert text to audio."""
        audio_file_path = await self.tts.text_to_audio(request.text, request.language)       
        conv = conversion_crud.create_with_owner(
            db=self.db,
            obj_in={
                "file_name": f"text_input_{audio_file_path.stem}",
                "language": request.language,
                "source_type": "text",
                "text_content": request.text,
            },
            user_id=self.current_user.id,
            audio_file_path=str(audio_file_path),
        )
        return conv

    def list_conversions(self, skip=0, limit=100):
        """List user's conversions."""
        return conversion_crud.get_multi_by_owner(
            db=self.db, user_id=self.current_user.id, skip=skip, limit=limit
        )

    def get_conversion_by_id(self, conversion_id: int) -> Conversion:
        """Get a conversion by ID if it belongs to the current user."""
        conv = conversion_crud.get(self.db, conversion_id)
        if not conv:
            raise HTTPException(
                status_code=404,
                detail="Conversion not found"
            )
        if conv.user_id != self.current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions"
            )
        return conv

    def delete_conversion(self, conversion_id: int):
        """Delete a conversion by ID."""
        conv = self.get_conversion_by_id(conversion_id)      
        # Delete audio file if it exists
        file_path = Path(conv.audio_file_path)
        if file_path.exists():
            os.unlink(file_path)
        # Delete from database
        conversion_crud.remove(self.db, id=conv.id)
