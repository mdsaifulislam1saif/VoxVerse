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

class OCRProcessor:
    """OCR processor to extract text from images and PDFs with dynamic language support."""
    # Thread pool to run blocking operations asynchronously
    thread_pool = ThreadPoolExecutor()

    def __init__(self):
        # Cache EasyOCR reader objects for each language to avoid reloading
        self.reader_cache = {}

    async def _run_in_thread(self, fn, *args, **kwargs):
        """
        Run a blocking function in a separate thread to avoid blocking the event loop.
        """
        return await asyncio.get_running_loop().run_in_executor(
            self.thread_pool, partial(fn, *args, **kwargs)
        )

    async def _get_reader(self, lang: str):
        """
        Get or create an EasyOCR reader for the given language.
        Adds English as a fallback if the selected language is not English.
        """
        if lang not in self.reader_cache:
            langs = [lang, "en"] if lang != "en" else ["en"]
            self.reader_cache[lang] = await self._run_in_thread(easyocr.Reader, langs)
        return self.reader_cache[lang]

    async def _process_image(self, img_data, lang: str) -> str:
        # Convert bytes to PIL image if necessary
        img = await self._run_in_thread(Image.open, io.BytesIO(img_data)) if isinstance(img_data, bytes) else img_data
        img_np = np.array(img)
        # Get OCR reader and read text
        reader = await self._get_reader(lang)
        ocr_result = await self._run_in_thread(reader.readtext, img_np)
        # Join all detected text pieces
        return " ".join(text for _, text, *_ in ocr_result) if ocr_result else ""

    async def _process_page(self, page, lang: str) -> str:
        # Extract text from the page
        text = await self._run_in_thread(page.get_text)

        # Extract and OCR all images on the page
        images = page.get_images()
        image_texts = [
            await self._process_image(
                (await self._run_in_thread(page.parent.extract_image, xref))["image"], lang
            )
            for xref, *_ in images
        ]
        return text + " " + " ".join(image_texts)

    async def pdf_to_text(self, pdf_path: Path, lang: str = "en") -> Tuple[str, str]:
        # Convert a PDF file to text.
        doc = await self._run_in_thread(fitz.open, pdf_path)
        # Process all pages concurrently
        results = await asyncio.gather(*[self._process_page(page, lang) for page in doc])
        await self._run_in_thread(doc.close)
        return " ".join(results), lang

    async def image_to_text(self, image_path: Path, lang: str = "en") -> Tuple[str, str]:
        # Convert an image file to text.
        img = await self._run_in_thread(Image.open, image_path)
        text = await self._process_image(img, lang)
        return text, lang
