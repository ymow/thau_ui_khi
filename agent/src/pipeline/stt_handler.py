"""
Speech-to-Text handler using Deepgram Nova-2.
"""
import asyncio
import logging
from typing import Optional

from deepgram import DeepgramClient, PrerecordedOptions, FileSource
from livekit import rtc

from config.settings import settings
from utils.audio_utils import audio_frame_to_bytes, combine_audio_frames, calculate_audio_duration

logger = logging.getLogger(__name__)


class DeepgramSTTHandler:
    """
    Handles speech-to-text using Deepgram Nova-2 API.
    """

    def __init__(self):
        """Initialize Deepgram client."""
        if not settings.DEEPGRAM_API_KEY:
            raise ValueError("DEEPGRAM_API_KEY not set in environment")

        self.client = DeepgramClient(settings.DEEPGRAM_API_KEY)
        logger.info("Deepgram STT handler initialized")

    async def transcribe(self, audio_data: bytes, sample_rate: int = 16000) -> Optional[str]:
        """
        Transcribe audio bytes to text.

        Args:
            audio_data: Raw PCM audio bytes
            sample_rate: Audio sample rate in Hz

        Returns:
            Transcribed text or None if transcription fails
        """
        try:
            # Calculate audio duration for logging
            duration = calculate_audio_duration(audio_data, sample_rate)
            logger.info(f"Transcribing audio: {len(audio_data)} bytes, {duration:.2f}s")

            # Prepare audio source
            payload: FileSource = {
                "buffer": audio_data,
            }

            # Configure Deepgram options
            options = PrerecordedOptions(
                model="nova-2",
                language="en-US",
                punctuate=True,
                smart_format=True,
                utterances=False,
                diarize=False,
            )

            # Send to Deepgram API
            response = await asyncio.to_thread(
                self.client.listen.rest.v("1").transcribe_file,
                payload,
                options,
            )

            # Extract transcription
            if response and response.results:
                channels = response.results.channels
                if channels and len(channels) > 0:
                    alternatives = channels[0].alternatives
                    if alternatives and len(alternatives) > 0:
                        transcript = alternatives[0].transcript
                        confidence = alternatives[0].confidence

                        logger.info(
                            f"Transcription successful: '{transcript}' "
                            f"(confidence: {confidence:.2f})"
                        )

                        # Return empty string if only silence detected
                        if not transcript or transcript.strip() == "":
                            logger.info("No speech detected (silence)")
                            return ""

                        return transcript

            logger.warning("No transcription found in Deepgram response")
            return None

        except Exception as e:
            logger.error(f"Deepgram transcription error: {e}", exc_info=True)
            return None

    async def transcribe_frames(self, frames: list[rtc.AudioFrame]) -> Optional[str]:
        """
        Transcribe multiple audio frames.

        Args:
            frames: List of LiveKit AudioFrames

        Returns:
            Transcribed text or None if transcription fails
        """
        if not frames:
            logger.warning("No audio frames to transcribe")
            return None

        # Combine frames into single audio buffer
        audio_bytes = combine_audio_frames(frames)

        # Use sample rate from first frame
        sample_rate = frames[0].sample_rate

        # Transcribe
        return await self.transcribe(audio_bytes, sample_rate)
