from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.schemas.summarization import SummarizationResponse, TextSummarizationRequest
from app.services.gemini_service import GeminiProcessor

# Router for text summarization endpoints
router = APIRouter()
# Initialize Gemini LLM processor
gemini_processor = GeminiProcessor()

@router.post("/summary", response_model=SummarizationResponse)
async def convert_text_to_summary(request: TextSummarizationRequest):
    """
    Summarize a given text using the Gemini service.
    - Expects input: text, language, and summary type.
    - Uses GeminiProcessor to generate a concise summary.
    - Returns both original and summarized content.
    """
    # Validate: ensure text is not empty
    if not request.text.strip():
        raise HTTPException(status_code=422, detail="Text content cannot be empty")
    try:
        # Generate summary using Gemini LLM
        summary_text = await gemini_processor.summarize_text(
            request.text, 
            request.language, 
            request.summary_type
        )       
        # Return structured response
        return SummarizationResponse(
            original_content=request.text,
            summary_content=summary_text,
            language=request.language,
            summary_type=request.summary_type
        )
    except Exception as e:
        # Catch unexpected errors and return 500 response
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")
