# Voice LLM Agent

Python-based LiveKit agent that orchestrates STT → LLM → TTS pipeline.

## Setup

```bash
# Using Poetry (recommended)
pip install poetry
poetry install
poetry shell

# Or using pip
pip install -r requirements.txt
```

## Configuration

Copy `.env.example` to `.env` in the project root and configure:

```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
DEEPGRAM_API_KEY=your-deepgram-api-key
GROQ_API_KEY=your-groq-api-key
CARTESIA_API_KEY=your-cartesia-api-key
```

## Running

```bash
# Using Poetry
poetry run python src/agent.py

# Or directly
python src/agent.py
```

## Testing

```bash
poetry run pytest
```

## Architecture

```
agent.py (main)
  ├── pipeline/
  │   ├── stt_handler.py     # Deepgram STT
  │   ├── llm_handler.py     # Groq LLM
  │   └── tts_handler.py     # Cartesia TTS
  ├── config/
  │   ├── settings.py        # Environment config
  │   └── prompts.py         # LLM prompts
  └── utils/
      ├── audio_utils.py     # Audio conversion
      └── logger.py          # Logging setup
```

## Development

```bash
# Format code
poetry run black .

# Lint code
poetry run ruff check .

# Type check
poetry run mypy src/
```
