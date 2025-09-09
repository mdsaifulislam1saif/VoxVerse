import asyncio
import google.generativeai as genai
from typing import Optional
from app.config.config import settings

class GeminiProcessor:
    """Service class to handle Google Gemini AI operations."""
    
    def __init__(self):
        """Initialize Gemini processor with API key."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash') 
    
    async def summarize_text(
        self, 
        text: str, 
        language: str = "en", 
        summary_type: str = "brief"
    ) -> str:
        """
        Summarize text using Google Gemini.
        
        Args:
            text: The text content to summarize
            language: Language code for the summary
            summary_type: Type of summary (brief, detailed, bullet_points)
        
        Returns:
            Summarized text
        """
        try:
            # Create prompt based on summary type
            prompt = self._create_prompt(text, language, summary_type)
            
            # Run the AI generation in a thread to avoid blocking
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
        """Create appropriate prompt based on summary type and language."""
        
        # Language-specific instructions
        language_instructions = {
            "en": "Please provide the summary in English.",
            "es": "Por favor, proporciona el resumen en español.",
            "fr": "Veuillez fournir le résumé en français.",
            "de": "Bitte stellen Sie die Zusammenfassung auf Deutsch bereit.",
            "it": "Si prega di fornire il riassunto in italiano.",
            "pt": "Por favor, forneça o resumo em português.",
            "ru": "Пожалуйста, предоставьте резюме на русском языке.",
            "ja": "日本語で要約を提供してください。",
            "ko": "한국어로 요약을 제공해 주세요.",
            "zh": "请用中文提供摘要。",
            "ar": "يرجى تقديم الملخص باللغة العربية.",
            "hi": "कृपया हिंदी में सारांश प्रदान करें।",
            "bn": "দয়া করে বাংলায় সারসংক্ষেপ প্রদান করুন।"
        }
        
        lang_instruction = language_instructions.get(language, "Please provide the summary in English.")
        
        # Summary type specific prompts
        if summary_type == "brief":
            type_instruction = "Create a brief, concise summary in 2-3 sentences that captures the main points."
        elif summary_type == "detailed":
            type_instruction = "Create a detailed summary that covers all important points, key details, and main arguments. Include relevant context and supporting information."
        elif summary_type == "bullet_points":
            type_instruction = "Create a summary using bullet points that highlight the key points, main ideas, and important details in an organized format."
        else:
            type_instruction = "Create a brief, concise summary in 2-3 sentences that captures the main points."
        
        prompt = f"""
                {type_instruction}

                {lang_instruction}

                Text to summarize:
                {text}

                Summary:
                """
        return prompt
    
    async def check_api_health(self) -> bool:
        """
        Check if Gemini API is accessible and working properly.
        
        Returns:
            bool: True if API is healthy, False otherwise
        """
        try:
            logger.info("Checking Gemini API health...")
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self._test_api_connection
            )
            
            is_healthy = bool(response and response.text)
            logger.info(f"Gemini API health check: {'PASSED' if is_healthy else 'FAILED'}")
            return is_healthy
            
        except Exception as e:
            logger.error(f"Gemini API health check failed: {str(e)}")
            return False
    
    def _test_api_connection(self):
        """Test API connection with a simple request."""
        return self.model.generate_content(
            "Hello, this is a test message. Please respond with 'API is working'.",
            generation_config=genai.types.GenerationConfig(
                temperature=0.1,
                max_output_tokens=20
            )
        )
    
    def get_supported_languages(self) -> list:
        """
        Get list of supported languages for summarization.
        
        Returns:
            list: List of supported language codes
        """
        return settings.SUPPORTED_LANGUAGES
    
    def get_summary_types(self) -> list:
        """
        Get list of available summary types.
        
        Returns:
            list: List of summary type options
        """
        return settings.SUMMARY_TYPES