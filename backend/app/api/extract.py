from fastapi import APIRouter, FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import asyncio
import os
import tempfile
from typing import Optional

# Import your existing services
from app.services.ocr_service import OCRProcessor
from app.services.tts_service import TTSProcessor
from app.schemas.extract import ExtractTextResponse

# Initialize services
ocr_processor = OCRProcessor()
tts_processor = TTSProcessor()

router = APIRouter()


@router.post("/pdf", response_model=ExtractTextResponse)
async def extract_text_from_pdf(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    """Extract text from uploaded PDF file."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_path = Path(temp_file.name)
        content = await file.read()
        temp_file.write(content)
    
    try:
        # Extract text using OCR processor
        extracted_text, detected_lang = await ocr_processor.pdf_to_text(temp_path, language)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from the PDF")
        
        return ExtractTextResponse(
            text=extracted_text,
            language=detected_lang,
            filename=file.filename
        )
    
    finally:
        # Clean up temporary file
        if temp_path.exists():
            os.unlink(temp_path)

@router.post("/image", response_model=ExtractTextResponse)
async def extract_text_from_image(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    """Extract text from uploaded image file."""
    allowed_exts = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400, 
            detail=f"Only image files {', '.join(allowed_exts)} are accepted"
        )
    
    # Create temporary file
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_path = Path(temp_file.name)
        content = await file.read()
        temp_file.write(content)
    
    try:
        # Extract text using OCR processor
        extracted_text, detected_lang = await ocr_processor.image_to_text(temp_path, language)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from the image")
        
        return ExtractTextResponse(
            text=extracted_text,
            language=detected_lang,
            filename=file.filename
        )
    
    finally:
        # Clean up temporary file
        if temp_path.exists():
            os.unlink(temp_path)

# @app.post("/convert/text-to-audio", response_model=AudioResponse)
# async def convert_text_to_audio(request: TextToAudioRequest):
#     """Convert text to audio file."""
#     if not request.text.strip():
#         raise HTTPException(status_code=422, detail="Text content cannot be empty")
    
#     try:
#         # Convert text to audio
#         audio_file_path = await tts_processor.text_to_audio(request.text, request.language)
        
#         return AudioResponse(
#             audio_file_path=str(audio_file_path),
#             text=request.text,
#             language=request.language
#         )
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to generate audio: {str(e)}")


# @app.get("/download-audio/{filename}")
# async def download_audio(filename: str):
#     """Download audio file."""
#     # Assuming audio files are stored in settings.AUDIO_DIR
#     # You may need to adjust this path based on your settings
#     audio_dir = Path("audio")  # Replace with actual audio directory from settings
#     file_path = audio_dir / filename
    
#     if not file_path.exists():
#         raise HTTPException(status_code=404, detail="Audio file not found")
    
#     return FileResponse(
#         path=str(file_path),
#         media_type="audio/wav",
#         filename=filename
#     )

# @app.get("/supported-languages")
# async def get_supported_languages():
#     """Get list of supported languages."""
#     return {
#         "languages": {
#             "en": "English",
#             "bn": "Bengali",
#             "es": "Spanish",
#             "fr": "French",
#             "de": "German",
#             "it": "Italian",
#             "pt": "Portuguese",
#             "ru": "Russian",
#             "ja": "Japanese",
#             "ko": "Korean",
#             "zh-cn": "Chinese (Simplified)",
#             "ar": "Arabic",
#             "hi": "Hindi"
#         }
#     }

# @app.get("/summary-types")
# async def get_summary_types():
#     """Get list of available summary types."""
#     return {
#         "types": {
#             "brief": "Brief (2-3 sentences)",
#             "detailed": "Detailed summary",
#             "bullet_points": "Bullet points format"
#         }
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)