from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
import os
import tempfile
from app.services.ocr_service import OCRProcessor
from app.services.tts_service import TTSProcessor
from app.schemas.extract import ExtractTextResponse

# Initialize services (OCR & TTS engines)
ocr_processor = OCRProcessor()
tts_processor = TTSProcessor()
# Router for OCR-related endpoints
router = APIRouter()

@router.post("/pdf", response_model=ExtractTextResponse)
async def extract_text_from_pdf(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    """
    Extract text from an uploaded PDF file.
    - Only accepts `.pdf` files.
    - Saves file temporarily, then runs OCRProcessor.
    - Returns extracted text, detected language, and original filename.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    # Save uploaded PDF as a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_path = Path(temp_file.name)
        content = await file.read()
        temp_file.write(content)
    try:
        # Perform OCR text extraction
        extracted_text, detected_lang = await ocr_processor.pdf_to_text(temp_path, language)
        if not extracted_text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from the PDF")
        # Return structured response
        return ExtractTextResponse(
            text=extracted_text,
            language=detected_lang,
            filename=file.filename
        )
    finally:
        # Ensure cleanup of temp file
        if temp_path.exists():
            os.unlink(temp_path)

@router.post("/image", response_model=ExtractTextResponse)
async def extract_text_from_image(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    """
    Extract text from an uploaded image file.
    - Accepts formats: JPG, JPEG, PNG, BMP, TIFF, WEBP.
    - Saves file temporarily, then runs OCRProcessor.
    - Returns extracted text, detected language, and original filename.
    """
    allowed_exts = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400, 
            detail=f"Only image files {', '.join(allowed_exts)} are accepted"
        )
    # Save uploaded image as a temporary file
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_path = Path(temp_file.name)
        content = await file.read()
        temp_file.write(content)
    try:
        # Perform OCR text extraction
        extracted_text, detected_lang = await ocr_processor.image_to_text(temp_path, language)
        if not extracted_text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from the image")
        # Return structured response
        return ExtractTextResponse(
            text=extracted_text,
            language=detected_lang,
            filename=file.filename
        )
    finally:
        # Ensure cleanup of temp file
        if temp_path.exists():
            os.unlink(temp_path)
