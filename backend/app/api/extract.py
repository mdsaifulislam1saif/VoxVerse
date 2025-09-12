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

