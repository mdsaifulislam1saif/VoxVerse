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

    # async def convert_pdf(self, file: UploadFile, language: str) -> Conversion:
    #     """Convert PDF file to audio."""
    #     if not file.filename.lower().endswith(".pdf"):
    #         raise HTTPException(400, "Only PDF files are accepted")
    #     file_path = settings.UPLOAD_DIR / file.filename
    #     try:
    #         content = await file.read()
    #         file_path.write_bytes(content)
    #         full_text, lang = await self.ocr.pdf_to_text(file_path, language)
    #         audio_file_path = await self.tts.text_to_audio(full_text, lang)
    #         conv = conversion_crud.create_with_owner(
    #             db=self.db,
    #             obj_in={
    #                 "file_name": file.filename,
    #                 "language": lang,
    #                 "source_type": "pdf",
    #                 "text_content": full_text
    #             },
    #             user_id=self.current_user.id,
    #             audio_file_path=str(audio_file_path),
    #         )
    #         return conv
    #     finally:
    #         if file_path.exists():
    #             os.unlink(file_path)

    # async def convert_image(self, file: UploadFile, language: str) -> Conversion:
    #     """Convert image file to audio."""
    #     allowed_exts = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")
    #     if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
    #         raise HTTPException(400, f"Only image files {', '.join(allowed_exts)} are accepted")
    #     file_path = settings.UPLOAD_DIR / file.filename
    #     try:
    #         content = await file.read()
    #         file_path.write_bytes(content)
    #         text, lang = await self.ocr.image_to_text(file_path, language)
    #         if not text:
    #             raise HTTPException(422, "Could not extract text from the image")         
    #         audio_file_path = await self.tts.text_to_audio(text, lang)            
    #         conv = conversion_crud.create_with_owner(
    #             db=self.db,
    #             obj_in={
    #                 "file_name": file.filename,
    #                 "language": lang,
    #                 "source_type": "image",
    #                 "text_content": text
    #             },
    #             user_id=self.current_user.id,
    #             audio_file_path=str(audio_file_path),
    #         )
    #         return conv
    #     finally:
    #         if file_path.exists():
    #             os.unlink(file_path)

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
