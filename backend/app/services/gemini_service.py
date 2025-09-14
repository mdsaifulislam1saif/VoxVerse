import asyncio
import google.generativeai as genai
from typing import Optional
from app.config.config import settings

class GeminiProcessor:
    """Service class to handle text summarization and other operations using Google Gemini AI."""
    def __init__(self):
        """Initialize the Gemini processor with the API key and model."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using the Gemini model 'gemini-1.5-flash'
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL) 
    
    async def summarize_text(
        self, 
        text: str, 
        language: str = "en", 
        summary_type: str = "brief"
    ) -> str:
        try:
            # Build a prompt according to the language and summary type
            prompt = self._create_prompt(text, language, summary_type)
            # Run the API call in a separate thread to avoid blocking the event loop
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.model.generate_content(prompt)
            )
            if not response.text:
                raise Exception("No summary generated")
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")
    
    def _create_prompt(self, text: str, language: str, summary_type: str) -> str:
        lang_instruction = settings.LANGUAGE_INSTRUCTIONS.get(language, "Please provide the summary in English.")
        # Instructions based on summary type
        if summary_type == "brief":
            type_instruction = settings.BRIEF
        elif summary_type == "detailed":
            type_instruction = settings.DETAILED
        elif summary_type == "bullet_points":
            type_instruction = settings.BULLET_POINTS
        else:
            type_instruction = settings.BRIEF
        # Construct the full prompt
        prompt = f"""
                {type_instruction}
                {lang_instruction}
                Text to summarize:
                {text}
                Summary:
                """
        return prompt

    async def check_api_health(self) -> bool:
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, self._test_api_connection)
            is_healthy = bool(response and response.text)
            return is_healthy
        except Exception as e:
            return False

    def _test_api_connection(self):
        """Send a simple request to test the API connection."""
        return self.model.generate_content(
            "Hello, this is a test message. Please respond with 'API is working'.",
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                max_output_tokens=20
            )
        )
    def get_supported_languages(self) -> list:
        """Return a list of languages supported for summarization."""
        return settings.SUPPORTED_LANGUAGES
    
    def get_summary_types(self) -> list:
        """Return a list of supported summary types (brief, detailed, bullet_points)."""
        return settings.SUMMARY_TYPES
