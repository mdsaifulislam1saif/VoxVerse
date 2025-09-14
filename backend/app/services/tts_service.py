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
        model_name = settings.LANG_TO_MODEL.get(
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
