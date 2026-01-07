"""
Main LiveKit agent for voice-enabled LLM.

This agent connects to LiveKit Cloud and processes voice through:
1. Receives audio from client
2. STT processing with Deepgram (Phase 2)
3. [Phase 3] LLM generation with Groq
4. [Phase 4] TTS synthesis with Cartesia
5. Sends audio back to client

Phase 1: Echo test - receives audio and sends it back
Phase 2: STT - transcribes audio to text
"""
import asyncio
import logging
from typing import Optional

from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    llm,
)

from config.settings import settings
from pipeline.stt_handler import DeepgramSTTHandler

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# Set to True to enable STT (Phase 2), False for echo test (Phase 1)
ENABLE_STT = True


class VoiceAgent:
    """
    Voice-enabled LLM agent.

    Phase 1: Echo test implementation
    Phase 2: STT transcription
    """

    def __init__(self, room: rtc.Room):
        """Initialize the agent with LiveKit room."""
        self.room = room
        self.audio_source: Optional[rtc.AudioSource] = None
        self.audio_buffer: list[rtc.AudioFrame] = []
        self.is_recording = False

        # Phase 2: Initialize STT handler
        self.stt_handler: Optional[DeepgramSTTHandler] = None
        if ENABLE_STT:
            try:
                self.stt_handler = DeepgramSTTHandler()
                logger.info("STT handler initialized")
            except Exception as e:
                logger.error(f"Failed to initialize STT handler: {e}")
                logger.info("Falling back to echo mode")

        logger.info("VoiceAgent initialized")

    async def start(self):
        """Start the agent and begin processing."""
        logger.info("Agent starting...")

        # Create audio source for sending audio back
        self.audio_source = rtc.AudioSource(sample_rate=16000, num_channels=1)

        # Publish audio track
        track = rtc.LocalAudioTrack.create_audio_track("agent-audio", self.audio_source)
        options = rtc.TrackPublishOptions(source=rtc.TrackSource.SOURCE_MICROPHONE)
        await self.room.local_participant.publish_track(track, options)

        logger.info("Agent ready - audio track published")

    async def process_audio_frame(self, frame: rtc.AudioFrame):
        """
        Process incoming audio frame.

        Phase 1: Echo the audio back (validation test)
        Phase 2: Buffer frames and transcribe when done

        Args:
            frame: Audio frame from participant
        """
        try:
            if ENABLE_STT and self.stt_handler:
                # Phase 2: Buffer audio frames
                self.audio_buffer.append(frame)
                self.is_recording = True
                logger.debug(f"Buffered audio frame: {len(self.audio_buffer)} frames")
            else:
                # Phase 1: Echo test - send audio back immediately
                if self.audio_source:
                    await self.audio_source.capture_frame(frame)
                    logger.debug(f"Echoed audio frame: {frame.sample_rate}Hz, {len(frame.data)} bytes")

        except Exception as e:
            logger.error(f"Error processing audio frame: {e}", exc_info=True)

    async def process_buffered_audio(self):
        """
        Process all buffered audio frames with STT.

        Phase 2: Send to STT for transcription
        Phase 3: Send to LLM for response
        Phase 4: Send to TTS for speech synthesis
        """
        if not self.audio_buffer:
            logger.info("No audio frames to process")
            return

        try:
            logger.info(f"Processing {len(self.audio_buffer)} buffered frames...")

            # Phase 2: Transcribe audio
            if self.stt_handler:
                transcription = await self.stt_handler.transcribe_frames(self.audio_buffer)

                if transcription:
                    logger.info(f"📝 Transcription: \"{transcription}\"")

                    # TODO: Phase 3 - Send to LLM
                    # response_text = await self.llm_handler.generate(transcription)
                    # logger.info(f"🤖 LLM Response: \"{response_text}\"")

                    # TODO: Phase 4 - Send to TTS
                    # response_audio = await self.tts_handler.synthesize(response_text)
                    # await self.audio_source.capture_frame(response_audio)

                    # For Phase 2, just log the transcription
                    # Echo will be removed in Phase 3
                else:
                    logger.warning("Transcription failed or returned empty")

        except Exception as e:
            logger.error(f"Error processing buffered audio: {e}", exc_info=True)
        finally:
            # Clear buffer
            self.audio_buffer.clear()
            self.is_recording = False


async def entrypoint(ctx: JobContext):
    """
    Main entry point for the LiveKit agent.

    This function is called when a participant joins a room.

    Args:
        ctx: Job context from LiveKit
    """
    logger.info(f"Agent connecting to room: {ctx.room.name}")

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Create agent instance
    agent = VoiceAgent(ctx.room)
    await agent.start()

    # Set up participant event handlers
    @ctx.room.on("track_subscribed")
    def on_track_subscribed(
        track: rtc.Track,
        publication: rtc.TrackPublication,
        participant: rtc.RemoteParticipant,
    ):
        """Handle when we subscribe to a participant's track."""
        logger.info(f"Subscribed to track: {track.sid} from {participant.identity}")

        if track.kind == rtc.TrackKind.KIND_AUDIO:
            audio_stream = rtc.AudioStream(track)

            # Process audio frames
            asyncio.create_task(process_audio_stream(audio_stream, agent))

    @ctx.room.on("participant_connected")
    def on_participant_connected(participant: rtc.RemoteParticipant):
        """Handle when a participant joins."""
        logger.info(f"Participant connected: {participant.identity}")

    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant: rtc.RemoteParticipant):
        """Handle when a participant leaves."""
        logger.info(f"Participant disconnected: {participant.identity}")

    logger.info("Agent ready and listening for audio")


async def process_audio_stream(stream: rtc.AudioStream, agent: VoiceAgent):
    """
    Process audio frames from a stream.

    Args:
        stream: Audio stream from participant
        agent: VoiceAgent instance
    """
    logger.info("Starting audio stream processing")

    try:
        async for frame_event in stream:
            frame = frame_event.frame
            await agent.process_audio_frame(frame)

        # When stream ends (user stopped speaking), process buffered audio
        if ENABLE_STT and agent.is_recording:
            logger.info("Audio stream ended, processing buffered audio...")
            await agent.process_buffered_audio()

    except Exception as e:
        logger.error(f"Error in audio stream processing: {e}", exc_info=True)


if __name__ == "__main__":
    # Run the agent with LiveKit CLI
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            # Agent will automatically reconnect on failure
            max_retry=5,
        )
    )
