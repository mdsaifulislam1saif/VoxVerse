import asyncio
from pathlib import Path
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from typing import Tuple
import easyocr
import fitz
import numpy as np
from PIL import Image
import io

class OCRProcessor:
    """OCR processor for images and PDFs with dynamic language support."""
    SUPPORTED_LANGUAGES = {
        "bn", "ja", "zh-cn", "zh-tw", "ko", "ru", "bg", "be", "uk",
        "cs", "pl", "sk", "da", "no", "sv", "nl", "de", "fr", "it",
        "es", "pt", "en"
    }
    thread_pool = ThreadPoolExecutor()
    def __init__(self):
        self.reader_cache = {}
        
    async def _run_in_thread(self, fn, *args, **kwargs):
        return await asyncio.get_running_loop().run_in_executor(
            self.thread_pool, partial(fn, *args, **kwargs)
        )

    async def _get_reader(self, lang: str):
        if lang not in self.reader_cache:
            langs = [lang, "en"] if lang != "en" else ["en"]
            self.reader_cache[lang] = await self._run_in_thread(easyocr.Reader, langs)
        return self.reader_cache[lang]

    async def _process_image(self, img_data, lang: str) -> str:
        img = await self._run_in_thread(Image.open, io.BytesIO(img_data)) if isinstance(img_data, bytes) else img_data
        img_np = np.array(img)
        reader = await self._get_reader(lang)
        ocr_result = await self._run_in_thread(reader.readtext, img_np)
        return " ".join(text for _, text, *_ in ocr_result) if ocr_result else ""

    async def _process_page(self, page, lang: str) -> str:
        text = await self._run_in_thread(page.get_text)
        images = page.get_images()
        image_texts = [
            await self._process_image((await self._run_in_thread(page.parent.extract_image, xref))["image"], lang)
            for xref, *_ in images
        ]
        return text + " " + " ".join(image_texts)

    async def pdf_to_text(self, pdf_path: Path, lang: str = "en") -> Tuple[str, str]:
        doc = await self._run_in_thread(fitz.open, pdf_path)
        results = await asyncio.gather(*[self._process_page(page, lang) for page in doc])
        await self._run_in_thread(doc.close)
        return " ".join(results), lang

    async def image_to_text(self, image_path: Path, lang: str = "en") -> Tuple[str, str]:
        img = await self._run_in_thread(Image.open, image_path)
        text = await self._process_image(img, lang)
        return text, lang
