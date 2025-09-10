from fastapi import APIRouter, UploadFile, File, Form, status, Body, HTTPException
from fastapi.responses import FileResponse
from app.schemas.summarization import SummarizationResponse, TextSummarizationRequest
from app.services.summarization_service import SummarizationService
from app.config.config import settings

router = APIRouter()

@router.post("/pdf", response_model=SummarizationResponse, status_code=status.HTTP_200_OK)
async def summarize_pdf_route(
    file: UploadFile = File(...),
    language: str = Form("en"),
    summary_type: str = Form("brief", description="Summary type: brief, detailed, or bullet_points"),
):
    """Summarize PDF file content using Google Gemini and convert to audio."""
    service = SummarizationService()
    return await service.summarize_pdf(file, language, summary_type)

@router.post("/image", response_model=SummarizationResponse, status_code=status.HTTP_200_OK)
async def summarize_image_route(
    file: UploadFile = File(...),
    language: str = Form("en"),
    summary_type: str = Form("brief", description="Summary type: brief, detailed, or bullet_points"),
):
    """Summarize image file content using Google Gemini and convert to audio."""
    service = SummarizationService()
    return await service.summarize_image(file, language, summary_type)

@router.post("/text", response_model=SummarizationResponse, status_code=status.HTTP_200_OK)
async def summarize_text_route(
    request: TextSummarizationRequest = Body(...),
):
    """Summarize text content using Google Gemini and convert to audio."""
    service = SummarizationService()
    return await service.summarize_text(request)

@router.get("/audio/{file_name}")
async def download_audio_file(file_name: str):
    """Download the generated audio file."""
    file_path = settings.AUDIO_OUTPUT_DIR / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        path=str(file_path),
        media_type="audio/mpeg",
        filename=file_name
    )