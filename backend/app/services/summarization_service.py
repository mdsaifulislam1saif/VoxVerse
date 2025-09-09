import os
import asyncio
from pathlib import Path
from fastapi import HTTPException, UploadFile
from app.config.config import settings
from app.schemas.summarization import TextSummarizationRequest, SummarizationResponse
from app.services.ocr_service import OCRProcessor
from app.services.gemini_service import GeminiProcessor
from app.services.tts_service import TTSProcessor

class SummarizationService:
    """Service class to handle summarization operations without database storage."""
    
    def __init__(self):
        self.ocr = OCRProcessor()
        self.gemini = GeminiProcessor()
        self.tts = TTSProcessor()

    async def summarize_pdf(self, file: UploadFile, language: str, summary_type: str = "brief") -> SummarizationResponse:
        """Summarize PDF file content and convert to audio."""
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(400, "Only PDF files are accepted")
        
        file_path = settings.UPLOAD_DIR / file.filename
        try:
            content = await file.read()
            file_path.write_bytes(content)
            
            # Extract text from PDF
            full_text, detected_lang = await self.ocr.pdf_to_text(file_path, language)
            
            if not full_text.strip():
                raise HTTPException(422, "Could not extract text from the PDF")
            
            # Generate summary using Gemini
            summary = await self.gemini.summarize_text(full_text, detected_lang, summary_type)
            
            # Convert summary to audio
            audio_file_path = await self.tts.text_to_audio(summary, detected_lang)
            
            return SummarizationResponse(
                file_name=file.filename,
                language=detected_lang,
                source_type="pdf",
                original_content=full_text,
                summary_content=summary,
                summary_type=summary_type,
                audio_file_path=str(audio_file_path)
            )
            
        finally:
            if file_path.exists():
                os.unlink(file_path)

    async def summarize_image(self, file: UploadFile, language: str, summary_type: str = "brief") -> SummarizationResponse:
        """Summarize image file content and convert to audio."""
        allowed_exts = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")
        if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
            raise HTTPException(400, f"Only image files {', '.join(allowed_exts)} are accepted")
        
        file_path = settings.UPLOAD_DIR / file.filename
        try:
            content = await file.read()
            file_path.write_bytes(content)
            
            # Extract text from image
            text, detected_lang = await self.ocr.image_to_text(file_path, language)
            
            if not text.strip():
                raise HTTPException(422, "Could not extract text from the image")
            
            # Generate summary using Gemini
            summary = await self.gemini.summarize_text(text, detected_lang, summary_type)
            
            # Convert summary to audio
            audio_file_path = await self.tts.text_to_audio(summary, detected_lang)
            
            return SummarizationResponse(
                file_name=file.filename,
                language=detected_lang,
                source_type="image",
                original_content=text,
                summary_content=summary,
                summary_type=summary_type,
                audio_file_path=str(audio_file_path)
            )
            
        finally:
            if file_path.exists():
                os.unlink(file_path)

    async def summarize_text(self, request: TextSummarizationRequest) -> SummarizationResponse:
        """Summarize text content and convert to audio."""
        if not request.text.strip():
            raise HTTPException(422, "Text content cannot be empty")
        
        # Generate summary using Gemini
        summary = await self.gemini.summarize_text(
            request.text, 
            request.language, 
            request.summary_type
        )
        
        # Convert summary to audio
        audio_file_path = await self.tts.text_to_audio(summary, request.language)
        
        return SummarizationResponse(
            file_name=f"text_input_{len(request.text)}_chars",
            language=request.language,
            source_type="text",
            original_content=request.text,
            summary_content=summary,
            summary_type=request.summary_type,
            audio_file_path=str(audio_file_path)
        )