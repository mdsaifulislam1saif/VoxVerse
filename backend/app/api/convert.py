from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, status, Body
from sqlalchemy.orm import Session
from app.core.auth import auth_service
from app.database.database import get_db
from app.models.user import User
from app.schemas.conversion import Conversion as ConversionSchema, TextToSpeechRequest
from app.services.conversion_service import ConversionService

router = APIRouter()

@router.post("/pdf", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_pdf_route(
    file: UploadFile = File(...),
    language: str = Form("en"),
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Convert PDF file to audio."""
    service = ConversionService(db, current_user)
    return await service.convert_pdf(file, language)

@router.post("/image", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_image_route(
    file: UploadFile = File(...),
    language: str = Form("en"),
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Convert image file to audio."""
    service = ConversionService(db, current_user)
    return await service.convert_image(file, language)

@router.post("/text", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_text_route(
    request: TextToSpeechRequest = Body(...),
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Convert text to audio."""
    service = ConversionService(db, current_user)
    return await service.convert_text(request)

@router.get("", response_model=List[ConversionSchema])
def list_conversions_route(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """List user's conversions."""
    service = ConversionService(db, current_user)
    return service.list_conversions(skip, limit)

@router.get("/{conversion_id}", response_model=ConversionSchema)
def get_conversion_route(
    conversion_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get a specific conversion."""
    service = ConversionService(db, current_user)
    return service.get_conversion_by_id(conversion_id)

@router.delete("/{conversion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversion_route(
    conversion_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete a conversion."""
    service = ConversionService(db, current_user)
    service.delete_conversion(conversion_id)
    return None