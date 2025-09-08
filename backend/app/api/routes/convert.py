import os
from pathlib import Path
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.conversion import Conversion
from app.crud.conversion import conversion as conversion_crud
from app.core.auth import AuthService 
from app.api.dependencies import ConversionService
from app.schemas.conversion import Conversion as ConversionSchema, TextToSpeechRequest
from app.config.config import settings
from app.services.ocr_service import OCRProcessor
from app.services.tts_service import TTSProcessor 

router = APIRouter()
auth = AuthService()
conversion = ConversionService()
ocr = OCRProcessor()
tts = TTSProcessor()

class ConversionService:
    """Service class for handling file/text-to-speech conversions."""

    def __init__(self, db: Session, current_user: User):
        self.db = db
        self.user = current_user

    async def convert_pdf(self, file: UploadFile, language: str) -> Conversion:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are accepted")
        file_path = settings.UPLOAD_DIR / file.filename
        try:
            content = await file.read()
            file_path.write_bytes(content)
            full_text, lang = await ocr.pdf_to_text(file_path, language)
            audio_file_path = await tts.text_to_audio(full_text, lang)
            conv = conversion_crud.create_with_owner(
                db=self.db,
                obj_in={
                    "file_name": file.filename,
                    "language": lang,
                    "source_type": "pdf",
                    "text_content": full_text
                },
                user_id=self.user.id,
                audio_file_path=str(audio_file_path)
            )
            return conv
        finally:
            if file_path.exists():
                os.unlink(file_path)

    async def convert_image(self, file: UploadFile, language: str) -> Conversion:
        allowed_exts = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")
        if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
            raise HTTPException(400, detail=f"Only image files {', '.join(allowed_exts)} are accepted")
        file_path = settings.UPLOAD_DIR / file.filename
        try:
            content = await file.read()
            file_path.write_bytes(content)
            text, lang = await ocr.image_to_text(file_path, language)
            if not text:
                raise HTTPException(422, detail="Could not extract text from the image")
            audio_file_path = await tts.text_to_audio(text, lang)
            conv = conversion_crud.create_with_owner(
                db=self.db,
                obj_in={
                    "file_name": file.filename,
                    "language": lang,
                    "source_type": "image",
                    "text_content": text
                },
                user_id=self.user.id,
                audio_file_path=str(audio_file_path)
            )
            return conv
        finally:
            if file_path.exists():
                os.unlink(file_path)

    async def convert_text(self, request: TextToSpeechRequest) -> Conversion:
        audio_file_path = await tts.text_to_audio(request.text, request.language)
        conv = conversion_crud.create_with_owner(
            db=self.db,
            obj_in={
                "file_name": f"text_input_{audio_file_path.stem}",
                "language": request.language,
                "source_type": "text",
                "text_content": request.text
            },
            user_id=self.user.id,
            audio_file_path=str(audio_file_path)
        )
        return conv

    def list_conversions(self, skip: int = 0, limit: int = 100) -> List[Conversion]:
        return conversion_crud.get_multi_by_owner(
            db=self.db, user_id=self.user.id, skip=skip, limit=limit
        )

    def delete_conversion(self, conv: Conversion):
        file_path = Path(conv.audio_file_path)
        if file_path.exists():
            os.unlink(file_path)
        conversion_crud.remove(self.db, id=conv.id)


# FastAPI routes using the service
@router.post("/pdf", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_pdf_route(
    file: UploadFile = File(...),
    language: str = Form("en"),
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    service = ConversionService(db, current_user)
    return await service.convert_pdf(file, language)


@router.post("/image", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_image_route(
    file: UploadFile = File(...),
    language: str = Form("en"),
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    service = ConversionService(db, current_user)
    return await service.convert_image(file, language)


@router.post("/text", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_text_route(
    request: TextToSpeechRequest,
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    service = ConversionService(db, current_user)
    return await service.convert_text(request)


@router.get("", response_model=List[ConversionSchema])
def list_conversions_route(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    service = ConversionService(db, current_user)
    return service.list_conversions(skip, limit)


@router.delete("/{conversion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversion_route(
    conv: Conversion = Depends(conversion.get_conversion_by_id),
    current_user: User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    service = ConversionService(db, current_user)
    service.delete_conversion(conv)
    return None
