# Change Proposal: MVP Foundation for Voice-Enabled LLM

## Overview

This proposal defines the Minimum Viable Product (MVP) for a voice-enabled LLM interface designed for hands-busy, eyes-busy scenarios such as motorcycle riding and car driving.

## Problem Statement

Users need to interact with LLM capabilities while riding/driving, but existing solutions either:
- Lack real-time voice interaction
- Don't handle extreme noise environments (helmet wind noise at 100km/h)
- Have unacceptable latency (>2s)
- Cannot maintain connection during mobile network transitions

## Proposed Solution

Build a WebRTC-based full-duplex voice interface with:
- Push-to-talk (PTT) activation
- Sub-2-second end-to-end latency
- Robust network reconnection
- Bluetooth HFP audio support
- iOS background audio capability

## MVP Scope

### What's Included (MVP Phase 1)

**Core Features:**
- Push-to-talk voice input (single button press)
- Speech-to-text using Deepgram Nova-2
- LLM text generation using Groq Llama 3 70B
- Text-to-speech output using Cartesia Sonic
- Basic noise suppression (Opus codec built-in)
- Single-turn conversation (user speaks → LLM responds → done)
- LiveKit WebRTC transport for low latency
- Network reconnection handling
- Bluetooth HFP audio support
- iOS background audio support

### What's Deferred (Post-MVP)

**Future Features:**
- Deep search with Perplexity API (30-60s async operations)
- Thread-like expandable summaries
- Script execution capability
- Multi-turn conversation history
- Advanced noise reduction (DeepFilterNet server-side)
- Voice Activity Detection (VAD) - continuous listening
- Conversation state persistence
- User authentication
- Usage analytics

## Architecture

### System Components

1. **Client Layer (React Native)**
   - Cross-platform iOS/Android application
   - PTT button interface
   - LiveKit SDK integration
   - Audio session management
   - Network monitoring

2. **Transport Layer (LiveKit Cloud)**
   - WebRTC-based real-time communication
   - Selective Forwarding Unit (SFU)
   - Bandwidth adaptation
   - Network resilience

3. **Agent Layer (Python Server)**
   - LiveKit Agents framework
   - Pipeline: STT → LLM → TTS
   - API orchestration
   - Error handling

4. **External APIs**
   - Deepgram Nova-2 (STT)
   - Groq Llama 3 70B (LLM)
   - Cartesia Sonic (TTS)

### Latency Budget

Target: <2 seconds end-to-end

```
Audio capture (client):        50ms
Network to LiveKit:           100ms
LiveKit to agent:              50ms
Deepgram STT:                 300ms
Groq LLM inference:           200ms
Cartesia TTS (first audio):   400ms
Network back to client:       100ms
Audio playback:                50ms
─────────────────────────────────
TOTAL:                      ~1,250ms (1.25s)
```

## Technology Stack

| Component | Technology | Justification |
|-----------|-----------|---------------|
| Client | React Native + Expo | Cross-platform, fast iteration, native audio access |
| Transport | LiveKit Cloud | WebRTC optimized, sub-200ms latency, network resilience |
| Agent | Python 3.11 + LiveKit Agents | Official integration, pipeline abstraction, async support |
| STT | Deepgram Nova-2 | State-of-the-art accuracy, low latency (~300ms), noise robust |
| LLM | Groq Llama 3 70B | Ultra-fast inference (~300 tokens/s), free tier available |
| TTS | Cartesia Sonic | Ultra-low latency (<500ms), natural voice quality |

## Implementation Phases

### Phase 0: Setup & Infrastructure (Week 1)
- Initialize React Native project with Expo
- Set up LiveKit Cloud account
- Create Python agent project structure
- Configure API keys and development environment
- Test basic LiveKit connection

### Phase 1: Audio Pipeline Foundation (Week 2)
- Implement PTT button in React Native UI
- Capture and stream audio to LiveKit
- Python agent receives audio track
- Echo audio back (validation test)

### Phase 2: STT Integration (Week 3)
- Integrate Deepgram SDK in Python agent
- Convert LiveKit audio frames to Deepgram format
- Receive and log transcriptions
- Handle Deepgram errors

### Phase 3: LLM Integration (Week 3-4)
- Integrate Groq SDK in Python agent
- Send transcriptions to Groq API
- Implement system prompt for driving context
- Handle API errors and timeouts

### Phase 4: TTS Integration (Week 4)
- Integrate Cartesia SDK in Python agent
- Convert LLM responses to audio
- Stream audio back through LiveKit
- Client plays audio through speaker

### Phase 5: Polish & Resilience (Week 5)
- Add loading states to UI
- Implement network reconnection logic
- Handle Bluetooth HFP audio routing
- iOS background audio support
- Error handling and user feedback
- Real device testing with helmet

## Success Criteria

### Functional Requirements
- User can press button and speak while riding
- LLM responds audibly within 2 seconds (P95)
- Transcription accuracy >80% in moderate noise (60-70 dB)
- Works on iOS and Android
- Survives network reconnection (3s dropout)
- Works with Bluetooth helmet audio (HFP)

### Non-Functional Requirements
- App doesn't crash during 10-minute ride
- Battery drain <20% per hour of active use
- Clear error states when APIs fail
- Simple one-screen interface

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bluetooth HFP audio quality too poor | HIGH | Test early, have phone fallback |
| API latency exceeds 2s | HIGH | Choose Groq for speed, monitor P95 |
| iOS background audio doesn't work | HIGH | Follow Apple guidelines, test early |
| Wind noise makes STT unusable | HIGH | Recommend windscreen, defer DeepFilterNet |

## Cost Estimate

### Development
- 5 weeks × 1 developer

### API Costs (per conversation turn)
```
Deepgram STT (5sec audio):  $0.0004
Groq LLM (free tier):       $0.0000
Cartesia TTS (50 words):    $0.0015
LiveKit bandwidth:          $0.0001
──────────────────────────────────
Total per turn:            ~$0.002 ($2/1000 turns)
```

### Monthly Infrastructure (MVP testing)
- LiveKit Cloud: Free tier (50 GB egress/month)
- Total: ~$20-50/month for testing

## Dependencies

### External Services
- LiveKit Cloud account
- Deepgram API key (pay-as-you-go)
- Groq API key (free tier: 14,400 requests/day)
- Cartesia API key

### Development Tools
- Node.js 18+ / npm or yarn
- Python 3.11+
- Xcode (for iOS development)
- Android Studio (for Android development)

### Hardware for Testing
- iPhone (iOS 15+) with development provisioning
- Android phone (Android 8+)
- Bluetooth motorcycle helmet system
- Motorcycle/scooter for real-world testing

## Timeline

**Total MVP Development:** 5 weeks

- Week 1: Setup & Infrastructure
- Week 2: Audio Pipeline Foundation
- Week 3: STT + LLM Integration
- Week 4: TTS Integration + End-to-End Testing
- Week 5: Polish, Resilience, Device Testing

## Post-MVP Roadmap

After MVP validation, planned enhancements:

**Phase 2 Features:**
1. Deep Search with Perplexity (async pattern, 30-60s)
2. Conversation history (multi-turn with context)
3. Thread-like expandable summaries
4. Server-side DeepFilterNet noise reduction
5. Voice Activity Detection (continuous listening)
6. Script execution capability
7. User authentication and profiles
8. Usage analytics and optimization

**Technical Improvements:**
1. Migrate to Expo Bare workflow if needed
2. Implement proper state management (Redux/Zustand)
3. Add error tracking (Sentry)
4. Set up CI/CD pipeline
5. Integration tests
6. Performance optimization

## Approval Requirements

- [ ] Confirm MVP scope (single-turn conversation, no deep search yet)
- [ ] Approve 5-week timeline
- [ ] Approve technology stack (React Native, LiveKit, Python)
- [ ] Confirm API budget allocation
- [ ] Confirm hardware availability for testing

## References

- Original research document (Chinese): Comprehensive analysis of voice-enabled LLM for driving scenarios
- LiveKit Documentation: https://docs.livekit.io/
- Deepgram API Docs: https://developers.deepgram.com/
- Groq API Docs: https://console.groq.com/docs
- Cartesia API Docs: https://docs.cartesia.ai/
