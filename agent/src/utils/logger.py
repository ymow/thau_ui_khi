"""
Logging configuration for the agent.
"""
import logging
import sys


def setup_logging(log_level: str = "info") -> None:
    """
    Configure logging for the application.

    Args:
        log_level: Logging level (debug, info, warning, error)
    """
    # Convert log level string to logging constant
    level = getattr(logging, log_level.upper(), logging.INFO)

    # Configure root logger
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

    # Set specific loggers
    logging.getLogger("livekit").setLevel(logging.INFO)
    logging.getLogger("deepgram").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance.

    Args:
        name: Logger name (usually __name__)

    Returns:
        Logger instance
    """
    return logging.getLogger(name)
