from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.schemas.summarization import SummarizationResponse, TextSummarizationRequest
from app.services.gemini_service import GeminiProcessor

router = APIRouter()
gemini_processor = GeminiProcessor()

@router.post("/summary", response_model=SummarizationResponse)
async def convert_text_to_summary(request: TextSummarizationRequest):
    """Convert text to summary."""
    if not request.text.strip():
        raise HTTPException(status_code=422, detail="Text content cannot be empty")
    try:
        # Generate summary using Gemini
        summary_text = await gemini_processor.summarize_text(
            request.text, 
            request.language, 
            request.summary_type
        )       
        return SummarizationResponse(
            original_content=request.text,
            summary_content=summary_text,
            language=request.language,
            summary_type=request.summary_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")


