import asyncio
import uuid
from functools import partial
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Optional
from TTS.api import TTS
from app.config.config import settings

class TTSProcessor:
    """Class to handle text-to-speech conversion using Coqui TTS."""
    LANG_TO_MODEL = {
        'en': 'tts_models/en/ljspeech/fast_pitch',
        'fr': 'tts_models/fr/mai/tacotron2-DDC',
        'de': 'tts_models/de/thorsten/tacotron2-DDC',
        'es': 'tts_models/es/mai/tacotron2-DDC',
        'it': 'tts_models/it/mai_female/glow-tts',
        'nl': 'tts_models/nl/mai/tacotron2-DDC',
        'pt': 'tts_models/pt/cv/vits',
        'pl': 'tts_models/pl/mai_female/vits',
        'tr': 'tts_models/tr/common-voice/glow-tts',
        'ja': 'tts_models/ja/kokoro/tacotron2-DDC',
        'zh-cn': 'tts_models/zh-CN/baker/tacotron2-DDC-GST',
        'bn': 'tts_models/bn/custom/vits-male',
        'bg': 'tts_models/bg/cv/vits',
        'cs': 'tts_models/cs/cv/vits',
        'da': 'tts_models/da/cv/vits',
        'et': 'tts_models/et/cv/vits',
        'ga': 'tts_models/ga/cv/vits',
        'el': 'tts_models/el/cv/vits',
        'fi': 'tts_models/fi/css10/vits',
        'hr': 'tts_models/hr/cv/vits',
        'hu': 'tts_models/hu/css10/vits',
        'lt': 'tts_models/lt/cv/vits',
        'lv': 'tts_models/lv/cv/vits',
        'mt': 'tts_models/mt/cv/vits',
        'ro': 'tts_models/ro/cv/vits',
        'sk': 'tts_models/sk/cv/vits',
        'sl': 'tts_models/sl/cv/vits',
        'sv': 'tts_models/sv/cv/vits',
        'uk': 'tts_models/uk/mai/vits',
        'ca': 'tts_models/ca/custom/vits',
        'fa': 'tts_models/fa/custom/glow-tts',
        'be': 'tts_models/be/common-voice/glow-tts'
    }
    thread_pool = ThreadPoolExecutor()

    def __init__(self, device: str = settings.DEVICE):
        self.device = device

    async def _run_in_thread(self, fn, *args, **kwargs):
        """Run a blocking function in a thread pool."""
        return await asyncio.get_event_loop().run_in_executor(
            self.thread_pool, partial(fn, *args, **kwargs)
        )

    async def text_to_audio(
        self,
        text: str,
        lang: str,
        speaker: Optional[str] = None,
        max_retries: int = 5,
        retry_delay: int = 10
    ) -> Path:
        """Convert text into speech and save as audio file."""
        model_name = self.LANG_TO_MODEL.get(
            lang, 'tts_models/multilingual/multi-dataset/your_tts'
        )
        settings.AUDIO_DIR.mkdir(parents=True, exist_ok=True)
        for attempt in range(max_retries):
            try:
                # Load TTS model
                tts = await self._run_in_thread(lambda: TTS(model_name=model_name).to(self.device))
                # Save audio file
                output_file = settings.AUDIO_DIR / f"Audio_{lang}_{uuid.uuid4()}.wav"
                await self._run_in_thread(
                    tts.tts_to_file,
                    text=text,
                    file_path=str(output_file),
                    speaker=speaker
                )
                return output_file
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                else:
                    raise RuntimeError(f"Failed to generate audio after {max_retries} attempts") from e
# async def main():
#     tts = TTSProcessor()
#     audio_file = await tts.text_to_audio(
#         "এখানে আমি ভাত খাই একটি সম্পূর্ণ অর্থ প্রকাশ করে, তাই এটি একটি বাক্য।",
#         lang="bn"
#     )
#     print("Audio generated successfully:", audio_file)


# if __name__ == "__main__":
#     asyncio.run(main())
