# MVP Requirements: Voice-Enabled LLM for Driving

## Document Information

- **Version:** 1.0.0
- **Status:** Draft
- **Last Updated:** 2026-01-07
- **Owner:** Development Team

## Purpose

This document defines the Minimum Viable Product (MVP) requirements for a voice-enabled LLM interface designed for hands-busy, eyes-busy scenarios such as motorcycle riding and car driving.

## Target Users

1. **Primary:** Motorcycle riders who want hands-free access to LLM capabilities while riding
2. **Secondary:** Car drivers who want voice interaction with LLM while driving

## Core Value Proposition

Enable users to have natural voice conversations with an LLM in environments where hands and eyes are occupied, with emphasis on safety, low latency, and robust performance in noisy conditions.

## MVP Feature Set

### In Scope

The MVP includes:

1. **Voice Input**
   - Push-to-talk button interface
   - Single-button activation
   - Microphone capture during button hold

2. **Speech Processing**
   - Speech-to-text transcription (Deepgram Nova-2)
   - Support for English language
   - Noise-tolerant transcription

3. **LLM Interaction**
   - Natural language understanding (Groq Llama 3 70B)
   - Concise, driving-appropriate responses
   - Single-turn conversation

4. **Voice Output**
   - Text-to-speech synthesis (Cartesia Sonic)
   - Natural-sounding voice
   - Audio playback through device or Bluetooth

5. **Connectivity**
   - WebRTC-based real-time communication (LiveKit)
   - Low-latency audio transmission (<200ms network)
   - Automatic reconnection

6. **Platform Support**
   - iOS 15+ support
   - Android 8.0+ support
   - Bluetooth audio support (HFP)
   - Background audio (iOS)

### Out of Scope (Post-MVP)

The following features are explicitly deferred:

1. **Advanced Features**
   - Deep search with extended processing time (30-60s)
   - Thread-like conversation interface with expandable summaries
   - Script execution and device control
   - Multi-turn conversation with context memory
   - Voice Activity Detection (continuous listening)

2. **Advanced Audio Processing**
   - Server-side noise reduction (DeepFilterNet)
   - Echo cancellation beyond codec defaults
   - Custom audio preprocessing

3. **User Management**
   - User authentication and profiles
   - Conversation history persistence
   - Usage analytics and reporting
   - Multi-user support

## Key Requirements

### Functional Requirements

#### FR-001: Voice Input via Push-to-Talk
- User can press and hold a button to record voice
- Recording starts within 50ms of button press
- Recording continues while button is held (max 30 seconds)
- Recording stops immediately on button release
- Visual and haptic feedback during recording

#### FR-002: Speech-to-Text Transcription
- User speech is transcribed to text
- Transcription accuracy >80% in moderate noise (60-70 dB)
- Transcription accuracy >95% in quiet environment
- Transcription latency <500ms after audio ends
- Handles silence gracefully (returns empty string)

#### FR-003: LLM Response Generation
- Transcribed text is processed by LLM
- LLM generates concise, voice-appropriate responses
- Responses are 1-3 sentences for most queries
- Response latency <400ms
- Responses avoid complex structures (lists, tables)

#### FR-004: Text-to-Speech Output
- LLM response is converted to natural speech
- First audio chunk arrives within 600ms
- Audio quality is natural and intelligible
- Audio works over Bluetooth HFP (16kHz or 8kHz)

#### FR-005: End-to-End Latency
- Total latency from speech end to response start <2s (P95)
- Total latency <1.5s (P50)
- User sees processing state ("Thinking...") during wait
- Timeout after 15 seconds with error message

### Non-Functional Requirements

#### NFR-001: Performance
- Battery consumption <20% per hour of active use
- Memory usage <150 MB (iOS) / <200 MB (Android)
- App launch time <3 seconds
- No crashes during 10-minute continuous session

#### NFR-002: Reliability
- Handles network disconnection gracefully
- Automatic reconnection with exponential backoff
- Survives 3-second network dropout
- Handles API errors without crashing

#### NFR-003: Usability
- Single-screen interface (no navigation)
- Dark theme for night visibility
- High contrast for sunlight readability
- Large touch targets for gloved use (>120px)
- Clear visual status indicators

#### NFR-004: Audio Quality
- Works with Bluetooth helmet audio systems
- Supports wideband speech (16kHz) when available
- Gracefully degrades to narrowband (8kHz)
- Auto-routes audio to connected Bluetooth device

#### NFR-005: Security
- All API keys stored on server only
- Audio encrypted in transit (DTLS-SRTP)
- No audio/transcription persistence (MVP)
- Compliance with platform privacy policies

## Success Criteria

The MVP is successful if:

### Functional Success
1. User can press button and speak while riding/driving
2. System transcribes speech with >80% accuracy in field conditions
3. LLM generates relevant, concise responses
4. Response is spoken back within 2 seconds (P95)
5. Works on both iOS and Android
6. Works with Bluetooth audio devices
7. Maintains connection during typical riding scenarios

### Technical Success
1. End-to-end latency meets targets (<2s P95)
2. App stability: zero crashes during testing sessions
3. Battery efficiency: <20% drain per hour
4. Network resilience: survives common dropout scenarios
5. Error handling: all errors handled gracefully

### User Experience Success
1. Interface is usable with gloves
2. Interface is readable in bright sunlight and at night
3. Status indicators are clear and unambiguous
4. Error messages are helpful and actionable
5. Users report feeling safe using it while riding/driving

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────┐
│     React Native Client (Mobile)        │
│  - PTT Button Interface                 │
│  - Audio Capture/Playback               │
│  - LiveKit SDK                          │
│  - Network Monitoring                   │
└──────────────┬──────────────────────────┘
               │ WebRTC (Opus)
               │ <200ms latency
┌──────────────▼──────────────────────────┐
│        LiveKit Cloud (SFU)              │
│  - Audio Routing                        │
│  - Bandwidth Adaptation                 │
└──────────────┬──────────────────────────┘
               │ WebRTC
┌──────────────▼──────────────────────────┐
│     Python Agent Server                 │
│  ┌────────────────────────────────────┐ │
│  │  STT (Deepgram Nova-2)             │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  LLM (Groq Llama 3 70B)            │ │
│  └────────────┬───────────────────────┘ │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  TTS (Cartesia Sonic)              │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Client | React Native | 0.73+ |
| Client Framework | Expo | 50+ |
| Language (Client) | TypeScript | 5.0+ |
| Transport | LiveKit SDK | Latest |
| Agent | Python | 3.11+ |
| Agent Framework | LiveKit Agents | Latest |
| STT | Deepgram Nova-2 | API |
| LLM | Groq (Llama 3 70B) | API |
| TTS | Cartesia Sonic | API |

## Latency Budget

Target end-to-end latency: 1.2 seconds (typical), 2.0 seconds (P95)

| Stage | Target Latency | Component |
|-------|---------------|-----------|
| Audio capture | 50ms | Client |
| Network upload | 100ms | WebRTC |
| Server receive | 50ms | LiveKit |
| STT processing | 300ms | Deepgram |
| LLM generation | 200ms | Groq |
| TTS generation | 400ms | Cartesia |
| Network download | 100ms | WebRTC |
| Audio playback | 50ms | Client |
| **Total** | **1,250ms** | **End-to-end** |

## Constraints & Assumptions

### Technical Constraints
1. Bluetooth HFP limited to 16kHz max (often 8kHz)
2. iOS background audio requires specific entitlements
3. Mobile network latency variable (50-300ms)
4. API rate limits apply (Groq free tier: 14,400 req/day)

### Assumptions
1. User has modern smartphone (iOS 15+ or Android 8+)
2. User has data connectivity (4G/5G) while riding
3. User has Bluetooth audio device (helmet or headset)
4. User's helmet microphone has basic wind protection
5. Most queries are short (<10 seconds of speech)
6. Most responses are short (1-3 sentences)

### Known Limitations
1. Wind noise at high speeds (>100 km/h) may reduce accuracy
2. Bluetooth audio quality lower than wired
3. Network dropouts in tunnels/rural areas will interrupt service
4. Background audio on iOS may be interrupted by phone calls
5. Very long responses (>30 seconds) may exceed cognitive load

## Risk Mitigation

### High-Priority Risks

1. **Risk:** Bluetooth HFP audio quality too poor for STT
   - **Mitigation:** Test early with real helmet systems; have phone speaker fallback

2. **Risk:** iOS background audio restrictions
   - **Mitigation:** Follow Apple guidelines precisely; test extensively

3. **Risk:** Wind noise makes STT unusable
   - **Mitigation:** Recommend windscreen; defer DeepFilterNet to post-MVP

4. **Risk:** API latency exceeds targets
   - **Mitigation:** Choose fastest providers (Groq); monitor P95; optimize pipeline

5. **Risk:** Network reconnection fails frequently
   - **Mitigation:** Use LiveKit's built-in reconnection; add custom monitoring

## Development Phases

### Phase 0: Setup & Infrastructure (Week 1)
- Initialize projects (React Native, Python)
- Set up API accounts and keys
- Configure development environments
- Verify basic LiveKit connectivity

### Phase 1: Audio Pipeline (Week 2)
- Implement PTT button and UI
- Set up audio capture and transmission
- Implement echo test (validation)
- Set up audio playback

### Phase 2: STT Integration (Week 3)
- Integrate Deepgram API
- Convert audio formats
- Test transcription accuracy
- Handle errors

### Phase 3: LLM Integration (Week 3-4)
- Integrate Groq API
- Implement prompt engineering
- Test response quality
- Handle errors

### Phase 4: TTS Integration (Week 4)
- Integrate Cartesia API
- Generate speech audio
- Test audio quality
- Complete end-to-end pipeline

### Phase 5: Polish & Testing (Week 5)
- Add loading states and UI polish
- Implement network resilience
- Configure Bluetooth and background audio
- Real-world device testing
- Performance optimization

## Testing Strategy

### Unit Testing
- Audio format conversion
- API error handling
- State management logic
- Utility functions

### Integration Testing
- STT pipeline (audio → text)
- LLM pipeline (text → response)
- TTS pipeline (text → audio)
- Full pipeline (audio → audio)

### Manual Device Testing
- iOS device with Bluetooth headset
- Android device with Bluetooth headset
- Real motorcycle helmet system
- Various network conditions (WiFi, 4G, 5G, poor signal)
- Background/foreground transitions
- Screen lock scenarios

### Field Testing
- Actual motorcycle riding (various speeds)
- Actual car driving
- Different weather conditions
- Different noise levels
- Various Bluetooth devices

## Deployment

### Python Agent
- Containerized with Docker
- Deployed to Render/Railway/Fly.io
- Environment variables for API keys
- Auto-restart on failure
- Log aggregation

### Client App
- iOS: TestFlight distribution
- Android: Internal Testing track
- OTA updates via Expo (development)
- App Store/Play Store (production, post-MVP)

## Success Metrics

### Quantitative Metrics
- P50 latency < 1.5 seconds
- P95 latency < 2.0 seconds
- STT accuracy > 80% (field conditions)
- Crash rate < 1% of sessions
- Battery drain < 20% per hour
- Reconnection success rate > 95%

### Qualitative Metrics
- User feedback: "feels responsive"
- User feedback: "easy to use while riding"
- User feedback: "audio quality acceptable"
- User feedback: "interface not distracting"

## Post-MVP Roadmap

After successful MVP validation:

### Phase 2: Enhanced Capabilities
1. Deep search integration (Perplexity API)
2. Multi-turn conversations with context
3. Expandable summary interface
4. Script execution for device control

### Phase 3: Audio Improvements
1. Server-side DeepFilterNet noise reduction
2. Voice Activity Detection (continuous listening)
3. Barge-in support (interrupt LLM)
4. Custom voice selection

### Phase 4: Platform Maturity
1. User authentication and profiles
2. Conversation history
3. Usage analytics
4. A/B testing framework
5. Production CI/CD pipeline

## References

- OpenSpec Change Proposal: `/openspec/changes/001-mvp-foundation/proposal.md`
- Implementation Tasks: `/openspec/changes/001-mvp-foundation/tasks.md`
- Specification Deltas: `/openspec/changes/001-mvp-foundation/spec-deltas.md`
- LiveKit Documentation: https://docs.livekit.io/
- React Native Documentation: https://reactnative.dev/
- Expo Documentation: https://docs.expo.dev/

## Approval

- [ ] Product Owner
- [ ] Technical Lead
- [ ] UX Designer
- [ ] Security Review (if applicable)
- [ ] Ready for Implementation
