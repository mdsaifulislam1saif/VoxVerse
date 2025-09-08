import asyncio
from pathlib import Path
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from typing import Tuple
import easyocr
import fitz  # PyMuPDF
import numpy as np
from PIL import Image
import io
import logging

# Only log warnings and errors
logging.basicConfig(level=logging.WARNING, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


class OCRProcessor:
    """Class-based OCR processor for images and PDFs using EasyOCR + PyMuPDF."""

    SUPPORTED_LANGUAGES = {
        "bn", "ja", "zh-cn", "zh-tw", "ko", "ru", "bg", "be", "uk",
        "cs", "pl", "sk", "da", "no", "sv", "nl", "de", "fr", "it",
        "es", "pt", "en"
    }

    thread_pool = ThreadPoolExecutor()

    def __init__(self, lang: str = "en"):
        """Initialize OCR processor with language validation."""
        if lang not in self.SUPPORTED_LANGUAGES:
            lang = "en"
        self.lang = lang
        self.reader: easyocr.Reader = None

    async def _run_in_thread(self, fn, *args, **kwargs):
        """Run blocking function in a thread pool."""
        return await asyncio.get_running_loop().run_in_executor(
            self.thread_pool, partial(fn, *args, **kwargs)
        )

    async def _get_reader(self):
        """Initialize and cache EasyOCR reader."""
        if self.reader is None:
            langs = [self.lang, "en"] if self.lang != "en" else ["en"]
            self.reader = await self._run_in_thread(easyocr.Reader, langs)
        return self.reader

    async def _process_image(self, img_data) -> str:
        """Run OCR on a single image (bytes or PIL.Image)."""
        try:
            img = await self._run_in_thread(Image.open, io.BytesIO(img_data)) if isinstance(img_data, bytes) else img_data
            img_np = np.array(img)
            reader = await self._get_reader()
            ocr_result = await self._run_in_thread(reader.readtext, img_np)
            return " ".join(text for _, text, *_ in ocr_result) if ocr_result else ""
        except Exception:
            return ""

    async def _process_page(self, page) -> str:
        """Extract text + OCR from images on a single PDF page."""
        try:
            text = await self._run_in_thread(page.get_text)
            image_texts = [
                await self._process_image((await self._run_in_thread(page.parent.extract_image, xref))["image"])
                for xref, *_ in page.get_images()
            ]
            return text + " " + " ".join(image_texts)
        except Exception:
            return ""

    async def pdf_to_text(self, pdf_path: Path) -> Tuple[str, str]:
        """Convert entire PDF into text (embedded + OCR)."""
        try:
            doc = await self._run_in_thread(fitz.open, pdf_path)
            results = await asyncio.gather(*[self._process_page(page) for page in doc])
            await self._run_in_thread(doc.close)
            return " ".join(results), self.lang
        except Exception:
            return "", "en"

    async def image_to_text(self, image_path: Path) -> Tuple[str, str]:
        """Convert single image file into text using OCR."""
        try:
            img = await self._run_in_thread(Image.open, image_path)
            text = await self._process_image(img)
            return text, self.lang
        except Exception:
            return "", "en"
