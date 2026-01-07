# Voice-Enabled LLM for Driving

A real-time voice interface for interacting with Large Language Models (LLMs) in hands-busy, eyes-busy scenarios such as motorcycle riding and car driving.

## 🎯 Project Overview

This project enables users to have natural voice conversations with an LLM while their hands and eyes are occupied. Built with safety, low latency (<2s), and noise resilience as core design principles.

### Key Features (MVP)

- 🎤 **Push-to-Talk Voice Input**: Single-button voice activation
- 🗣️ **Speech-to-Text**: Powered by Deepgram Nova-2
- 🤖 **LLM Responses**: Ultra-fast responses via Groq (Llama 3 70B)
- 🔊 **Natural Speech Output**: High-quality TTS via Cartesia Sonic
- 📡 **Low-Latency WebRTC**: Real-time communication via LiveKit
- 🎧 **Bluetooth Support**: Works with helmet audio systems (HFP)
- 📱 **Cross-Platform**: iOS 15+ and Android 8.0+
- 🔄 **Network Resilience**: Auto-reconnection and error handling

## 🏗️ Architecture

```
┌─────────────────────┐
│  React Native App   │ (client/)
│  - PTT Interface    │
│  - Audio I/O        │
└──────────┬──────────┘
           │ WebRTC (<200ms)
┌──────────▼──────────┐
│   LiveKit Cloud     │
│  - Audio Routing    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Python Agent      │ (agent/)
│  - STT (Deepgram)   │
│  - LLM (Groq)       │
│  - TTS (Cartesia)   │
└─────────────────────┘
```

## 📁 Project Structure

```
thau_ui_khi/
├── client/              # React Native mobile app
│   ├── src/
│   │   ├── screens/     # UI screens
│   │   ├── components/  # Reusable components
│   │   ├── services/    # LiveKit, Audio services
│   │   └── hooks/       # Custom React hooks
│   └── package.json
│
├── agent/               # Python LiveKit agent
│   ├── src/
│   │   ├── agent.py     # Main agent logic
│   │   ├── pipeline/    # STT, LLM, TTS handlers
│   │   ├── config/      # Configuration & prompts
│   │   └── utils/       # Utilities
│   └── pyproject.toml
│
├── openspec/            # Spec-driven development
│   ├── specs/           # Source-of-truth specs
│   └── changes/         # Proposed changes
│
├── docs/                # Documentation
│   ├── setup-guide.md
│   ├── deployment.md
│   └── testing-guide.md
│
└── scripts/             # Helper scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- iOS: Xcode 15+ (macOS only)
- Android: Android Studio
- LiveKit Cloud account
- API keys: Deepgram, Groq, Cartesia

### 1. Clone and Setup

```bash
git clone <repository-url>
cd thau_ui_khi

# Copy environment template
cp .env.example .env
# Edit .env with your API keys
```

### 2. Setup Client (React Native)

```bash
cd client
npm install

# iOS
npx pod-install
npm run ios

# Android
npm run android
```

### 3. Setup Agent (Python)

```bash
cd agent
pip install poetry
poetry install
poetry run python src/agent.py
```

## 📖 Documentation

- **Setup Guide**: [docs/setup-guide.md](docs/setup-guide.md)
- **MVP Requirements**: [openspec/specs/mvp-requirements.md](openspec/specs/mvp-requirements.md)
- **Implementation Tasks**: [openspec/changes/001-mvp-foundation/tasks.md](openspec/changes/001-mvp-foundation/tasks.md)
- **API Documentation**: See individual service docs in `/docs`

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| Client | React Native + Expo |
| Language | TypeScript |
| Transport | LiveKit (WebRTC) |
| Agent | Python 3.11 + LiveKit Agents |
| STT | Deepgram Nova-2 |
| LLM | Groq (Llama 3 70B) |
| TTS | Cartesia Sonic |

## 🎯 Development Phases

- [x] **Phase 0**: Setup & Infrastructure
- [ ] **Phase 1**: Audio Pipeline Foundation
- [ ] **Phase 2**: STT Integration
- [ ] **Phase 3**: LLM Integration
- [ ] **Phase 4**: TTS Integration
- [ ] **Phase 5**: Polish & Resilience

Current Status: **Phase 0 - Setup Complete**

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| End-to-end latency (P50) | <1.5s |
| End-to-end latency (P95) | <2.0s |
| STT accuracy (quiet) | >95% |
| STT accuracy (moderate noise) | >80% |
| Battery drain | <20%/hour |
| Network reconnection | <3s |

## 🧪 Testing

```bash
# Client tests
cd client
npm test

# Agent tests
cd agent
poetry run pytest

# Manual testing
See docs/testing-guide.md
```

## 🚢 Deployment

### Python Agent

```bash
cd agent
docker build -t voice-llm-agent .
docker run -e LIVEKIT_URL=$LIVEKIT_URL ... voice-llm-agent
```

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

### Client App

- **iOS**: TestFlight distribution
- **Android**: Internal Testing track on Play Console

## 🛣️ Roadmap

### MVP (Current)
- ✅ Push-to-talk voice interface
- ✅ Single-turn conversation
- ✅ Basic noise handling (Opus codec)
- ✅ Bluetooth HFP support

### Post-MVP
- [ ] Deep search with Perplexity (30-60s operations)
- [ ] Multi-turn conversations with context
- [ ] Thread-like expandable summaries
- [ ] Advanced noise reduction (DeepFilterNet)
- [ ] Voice Activity Detection (continuous listening)
- [ ] Script execution capability
- [ ] User authentication

## 🤝 Contributing

This project uses OpenSpec for spec-driven development. Before implementing:

1. Check `openspec/specs/` for current requirements
2. Propose changes in `openspec/changes/`
3. Follow the implementation tasks checklist
4. Update specs after successful implementation

See [AGENTS.md](AGENTS.md) for AI assistant integration guidelines.

## 📝 License

[To be determined]

## 🙏 Acknowledgments

- Research paper: "車載環境下的語音優先代理架構" (Voice-First Agent Architecture for Driving Scenarios)
- Built with [LiveKit](https://livekit.io/), [Deepgram](https://deepgram.com/), [Groq](https://groq.com/), [Cartesia](https://cartesia.ai/)

## 📧 Contact

[Contact information to be added]

---

**Status**: 🚧 MVP Development In Progress

**Latest Update**: 2026-01-07 - OpenSpec foundation and project structure initialized
