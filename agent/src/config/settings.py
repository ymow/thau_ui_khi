"""
Configuration settings loaded from environment variables.
"""
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings."""

    # LiveKit Configuration
    LIVEKIT_URL: str = os.getenv("LIVEKIT_URL", "")
    LIVEKIT_API_KEY: str = os.getenv("LIVEKIT_API_KEY", "")
    LIVEKIT_API_SECRET: str = os.getenv("LIVEKIT_API_SECRET", "")

    # Deepgram Configuration
    DEEPGRAM_API_KEY: str = os.getenv("DEEPGRAM_API_KEY", "")

    # Groq Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Cartesia Configuration
    CARTESIA_API_KEY: str = os.getenv("CARTESIA_API_KEY", "")

    # Environment
    ENVIRONMENT: str = os.getenv("PYTHON_ENV", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")

    # Agent Configuration
    AGENT_HOST: str = os.getenv("AGENT_HOST", "0.0.0.0")
    AGENT_PORT: int = int(os.getenv("AGENT_PORT", "8080"))

    @classmethod
    def validate(cls) -> None:
        """Validate that all required settings are present."""
        required_settings = [
            ("LIVEKIT_URL", cls.LIVEKIT_URL),
            ("LIVEKIT_API_KEY", cls.LIVEKIT_API_KEY),
            ("LIVEKIT_API_SECRET", cls.LIVEKIT_API_SECRET),
            ("DEEPGRAM_API_KEY", cls.DEEPGRAM_API_KEY),
            ("GROQ_API_KEY", cls.GROQ_API_KEY),
            ("CARTESIA_API_KEY", cls.CARTESIA_API_KEY),
        ]

        missing = [name for name, value in required_settings if not value]

        if missing:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing)}. "
                f"Please check your .env file."
            )


# Validate settings on module import
Settings.validate()

settings = Settings()
