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

# Router for handling text-to-speech conversions
router = APIRouter()

@router.post("/text", response_model=ConversionSchema, status_code=status.HTTP_201_CREATED)
async def convert_text_route(
    request: TextToSpeechRequest = Body(...),
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Convert user-provided text into an audio file.
    - Requires authentication (current_user).
    - Saves conversion metadata to the database.
    - Returns conversion details (including file path).
    """
    service = ConversionService(db, current_user)
    return await service.convert_text(request)

@router.get("", response_model=List[ConversionSchema])
def list_conversions_route(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Get a paginated list of the authenticated user's conversions.
    - skip: number of records to skip (for pagination).
    - limit: max number of records to return.
    """
    service = ConversionService(db, current_user)
    return service.list_conversions(skip, limit)

@router.get("/{conversion_id}", response_model=ConversionSchema)
def get_conversion_route(
    conversion_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve a specific conversion by ID.
    - Ensures the conversion belongs to the authenticated user.
    """
    service = ConversionService(db, current_user)
    return service.get_conversion_by_id(conversion_id)

@router.get("/{conversion_id}/download")
def download_audio(
    conversion_id: int,
    inline: bool = False,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Download or stream an audio file for a specific conversion.
    - inline=False → force download.
    - inline=True  → stream/play directly in browser.
    - Automatically sets correct media type based on file extension.
    """
    service = ConversionService(db, current_user)
    conversion = service.get_conversion_by_id(conversion_id)
    
    file_path = Path(conversion.audio_file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Detect file type for proper Content-Type header
    media_type = "audio/wav"
    if file_path.suffix.lower() == ".mp3":
        media_type = "audio/mpeg"
    elif file_path.suffix.lower() == ".ogg":
        media_type = "audio/ogg"
    elif file_path.suffix.lower() == ".m4a":
        media_type = "audio/mp4"
    elif file_path.suffix.lower() == ".flac":
        media_type = "audio/flac"
    
    # Create a clean, user-friendly filename
    clean_filename = f"{conversion.file_name}_{conversion.id}{file_path.suffix}"
    
    return FileResponse(
        file_path,
        media_type=media_type,
        filename=clean_filename,
        # If inline=True → browser tries to play, else → downloads as attachment
        headers={"Content-Disposition": f"{'inline' if inline else 'attachment'}; filename={clean_filename}"}
    )

@router.get("/{conversion_id}/stream")
def stream_audio(
    conversion_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Stream an audio file for use in web players.
    - Always sets Content-Disposition=inline.
    - Supports range requests (for seeking).
    - Enables caching for performance.
    """
    service = ConversionService(db, current_user)
    conversion = service.get_conversion_by_id(conversion_id)
    
    file_path = Path(conversion.audio_file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Detect file type for streaming
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
            "Content-Disposition": "inline",  # Always play in-browser
            "Accept-Ranges": "bytes",         # Allow seeking/partial playback
            "Cache-Control": "public, max-age=3600"  # Cache for 1 hour
        }
    )

@router.delete("/{conversion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversion_route(
    conversion_id: int,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Delete a specific conversion by ID.
    - Removes metadata from the database.
    - Also removes the audio file (handled in service).
    """
    service = ConversionService(db, current_user)
    service.delete_conversion(conversion_id)
    return None
