"""
Audio utility functions for format conversion and processing.
"""
import numpy as np
from livekit import rtc


def audio_frame_to_bytes(frame: rtc.AudioFrame) -> bytes:
    """
    Convert LiveKit AudioFrame to raw PCM bytes.

    Args:
        frame: LiveKit AudioFrame

    Returns:
        Raw PCM audio bytes
    """
    # AudioFrame.data is already bytes in PCM format
    return bytes(frame.data)


def audio_frame_to_numpy(frame: rtc.AudioFrame) -> np.ndarray:
    """
    Convert LiveKit AudioFrame to numpy array.

    Args:
        frame: LiveKit AudioFrame

    Returns:
        Numpy array of audio samples (float32, normalized to [-1, 1])
    """
    # Convert bytes to numpy array
    # Assuming 16-bit PCM (int16)
    audio_data = np.frombuffer(frame.data, dtype=np.int16)

    # Convert to float32 and normalize to [-1, 1]
    audio_float = audio_data.astype(np.float32) / 32768.0

    return audio_float


def numpy_to_audio_frame(
    audio_array: np.ndarray, sample_rate: int = 16000, num_channels: int = 1
) -> rtc.AudioFrame:
    """
    Convert numpy array to LiveKit AudioFrame.

    Args:
        audio_array: Numpy array of audio samples (float32, [-1, 1])
        sample_rate: Sample rate in Hz
        num_channels: Number of audio channels

    Returns:
        LiveKit AudioFrame
    """
    # Ensure audio is in the correct format
    if audio_array.dtype != np.float32:
        audio_array = audio_array.astype(np.float32)

    # Clip to [-1, 1] range
    audio_array = np.clip(audio_array, -1.0, 1.0)

    # Convert to int16 PCM
    audio_int16 = (audio_array * 32767).astype(np.int16)

    # Convert to bytes
    audio_bytes = audio_int16.tobytes()

    # Calculate samples per channel
    samples_per_channel = len(audio_int16) // num_channels

    # Create AudioFrame
    frame = rtc.AudioFrame(
        data=audio_bytes,
        sample_rate=sample_rate,
        num_channels=num_channels,
        samples_per_channel=samples_per_channel,
    )

    return frame


def resample_audio(
    audio_array: np.ndarray, orig_sample_rate: int, target_sample_rate: int
) -> np.ndarray:
    """
    Resample audio to a different sample rate.

    Args:
        audio_array: Input audio as numpy array
        orig_sample_rate: Original sample rate
        target_sample_rate: Target sample rate

    Returns:
        Resampled audio as numpy array
    """
    if orig_sample_rate == target_sample_rate:
        return audio_array

    # Simple linear interpolation resampling
    # For production, consider using scipy.signal.resample or librosa
    duration = len(audio_array) / orig_sample_rate
    target_length = int(duration * target_sample_rate)

    resampled = np.interp(
        np.linspace(0, len(audio_array), target_length),
        np.arange(len(audio_array)),
        audio_array,
    )

    return resampled


def combine_audio_frames(frames: list[rtc.AudioFrame]) -> bytes:
    """
    Combine multiple audio frames into a single byte stream.

    Args:
        frames: List of LiveKit AudioFrames

    Returns:
        Combined audio bytes
    """
    combined = b""
    for frame in frames:
        combined += bytes(frame.data)
    return combined


def calculate_audio_duration(audio_bytes: bytes, sample_rate: int, num_channels: int = 1) -> float:
    """
    Calculate the duration of audio in seconds.

    Args:
        audio_bytes: Raw PCM audio bytes
        sample_rate: Sample rate in Hz
        num_channels: Number of channels

    Returns:
        Duration in seconds
    """
    # Assuming 16-bit PCM (2 bytes per sample)
    bytes_per_sample = 2
    num_samples = len(audio_bytes) // (bytes_per_sample * num_channels)
    duration = num_samples / sample_rate
    return duration
