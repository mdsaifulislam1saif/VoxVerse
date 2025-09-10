from typing import List
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, Form, status, Body, HTTPException
from fastapi.responses import FileResponse
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

@router.get("/{conversion_id}/download")
def download_audio(
    conversion_id: int,
    inline: bool = False,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Download or stream the audio file for a conversion."""
    service = ConversionService(db, current_user)
    conversion = service.get_conversion_by_id(conversion_id)
    
    file_path = Path(conversion.audio_file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Determine media type based on file extension
    media_type = "audio/wav"  # default
    if file_path.suffix.lower() == ".mp3":
        media_type = "audio/mpeg"
    elif file_path.suffix.lower() == ".ogg":
        media_type = "audio/ogg"
    elif file_path.suffix.lower() == ".m4a":
        media_type = "audio/mp4"
    elif file_path.suffix.lower() == ".flac":
        media_type = "audio/flac"
    
    # Generate a clean filename
    clean_filename = f"{conversion.file_name}_{conversion.id}{file_path.suffix}"
    
    return FileResponse(
        file_path,
        media_type=media_type,
        filename=clean_filename,
        # Use inline for streaming in browser, attachment for download
        headers={"Content-Disposition": f"{'inline' if inline else 'attachment'}; filename={clean_filename}"}
    )

@router.get("/{conversion_id}/stream")
def stream_audio(
    conversion_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """Stream audio file for web players."""
    service = ConversionService(db, current_user)
    conversion = service.get_conversion_by_id(conversion_id)
    
    file_path = Path(conversion.audio_file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Determine media type
    media_type = "audio/wav"
    if file_path.suffix.lower() == ".mp3":
        media_type = "audio/mpeg"
    elif file_path.suffix.lower() == ".ogg":
        media_type = "audio/ogg"
    elif file_path.suffix.lower() == ".m4a":
        media_type = "audio/mp4"
    elif file_path.suffix.lower() == ".flac":
        media_type = "audio/flac"
    
    return FileResponse(
        file_path,
        media_type=media_type,
        headers={
            "Content-Disposition": "inline",
            "Accept-Ranges": "bytes",  # Enable range requests for better streaming
            "Cache-Control": "public, max-age=3600"  # Cache for 1 hour
        }
    )

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