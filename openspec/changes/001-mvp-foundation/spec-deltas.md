# Specification Deltas: MVP Foundation

## Overview

This document tracks requirement changes for the Voice-Enabled LLM MVP. All requirements below are newly ADDED for this initial implementation.

---

## ADDED: Core Functional Requirements

### FR-001: Push-to-Talk Voice Input
**Status:** ADDED
**Priority:** CRITICAL
**Description:** User must be able to initiate voice input through a single button press.

**Requirements:**
- Button is visually prominent (minimum 120x120 logical pixels)
- Button provides immediate visual feedback when pressed
- Button provides haptic feedback on press (vibration)
- Audio capture starts immediately on press (< 50ms latency)
- Audio capture continues while button is held
- Audio capture stops immediately on release
- Maximum continuous recording duration: 30 seconds
- Minimum viable recording duration: 1 second

**Acceptance Criteria:**
- User can press and hold button
- Microphone activates within 50ms
- Visual state changes to "recording"
- Audio is captured and transmitted
- Release stops recording immediately

---

### FR-002: Speech-to-Text Transcription
**Status:** ADDED
**Priority:** CRITICAL
**Description:** System must convert user's speech to text with high accuracy.

**Requirements:**
- Use Deepgram Nova-2 API for transcription
- Support English language (en-US)
- Transcription includes punctuation
- Transcription latency < 500ms after audio ends
- Accuracy > 80% in moderate noise (60-70 dB ambient)
- Accuracy > 95% in quiet environment (< 40 dB ambient)
- Handle empty audio (silence) gracefully
- Return error for unintelligible audio

**Acceptance Criteria:**
- Clear speech is transcribed with >95% accuracy
- Transcription completes within 500ms
- Silence returns empty string (not error)
- API errors are caught and handled

---

### FR-003: LLM Response Generation
**Status:** ADDED
**Priority:** CRITICAL
**Description:** System must generate contextually appropriate responses using LLM.

**Requirements:**
- Use Groq API with Llama 3 70B model
- Response optimized for voice delivery (concise)
- Response latency < 400ms
- Response length: 1-3 sentences for most queries
- Response avoids lists, tables, or complex structures
- Response is appropriate for driving context (no distractions)
- Handle API errors gracefully
- Timeout after 10 seconds

**Acceptance Criteria:**
- Responses are contextually relevant
- Responses are concise (readable in < 10 seconds)
- LLM responds within 400ms (P95)
- Errors are handled without crashing

---

### FR-004: Text-to-Speech Audio Output
**Status:** ADDED
**Priority:** CRITICAL
**Description:** System must convert LLM text response to natural-sounding speech.

**Requirements:**
- Use Cartesia Sonic API for TTS
- Natural-sounding voice (not robotic)
- Audio latency < 600ms to first audio chunk
- Audio sample rate: 16kHz or higher
- Audio format compatible with LiveKit (Opus codec)
- Handle text with punctuation (natural pauses)
- Support emphasis and intonation
- Handle API errors gracefully

**Acceptance Criteria:**
- Audio is natural and intelligible
- First audio plays within 600ms
- Audio quality acceptable over Bluetooth HFP
- Errors are handled without crashing

---

### FR-005: End-to-End Conversation Latency
**Status:** ADDED
**Priority:** CRITICAL
**Description:** Total latency from speech end to response start must be acceptable.

**Requirements:**
- End-to-end latency < 2 seconds (P95)
- End-to-end latency < 1.5 seconds (P50)
- Latency tracking at each pipeline stage
- User receives feedback during processing ("Thinking...")
- Timeout after 15 seconds with error message

**Latency Budget:**
```
Audio capture:         50ms
Network to server:    100ms
STT processing:       300ms
LLM generation:       200ms
TTS generation:       400ms
Network to client:    100ms
Audio playback:        50ms
───────────────────────────
Total target:       1,200ms (1.2s)
P95 target:         2,000ms (2.0s)
```

**Acceptance Criteria:**
- 95% of requests complete within 2 seconds
- 50% of requests complete within 1.5 seconds
- User sees "Thinking" state during processing
- Timeout triggers clear error message

---

## ADDED: Audio & Communication Requirements

### FR-006: LiveKit WebRTC Transport
**Status:** ADDED
**Priority:** CRITICAL
**Description:** All audio communication uses LiveKit WebRTC for low latency.

**Requirements:**
- Client connects to LiveKit room on app launch
- Audio codec: Opus (optimized for voice)
- Audio track published on PTT press
- Audio track unpublished on PTT release
- Automatic bandwidth adaptation
- Support for lossy network conditions
- Network latency < 150ms (P95)
- Packet loss tolerance up to 5%

**Acceptance Criteria:**
- Client successfully connects to LiveKit room
- Audio transmits with < 150ms network latency
- Connection survives minor packet loss
- Bandwidth adapts to network conditions

---

### FR-007: Bluetooth HFP Audio Support
**Status:** ADDED
**Priority:** HIGH
**Description:** System must work with Bluetooth helmet audio systems.

**Requirements:**
- Support Bluetooth HFP (Hands-Free Profile)
- Support wideband speech when available (16kHz)
- Gracefully degrade to narrowband (8kHz) if needed
- Auto-route audio to Bluetooth when connected
- Fallback to phone speaker if Bluetooth disconnects
- Visual indicator for Bluetooth connection status
- Handle Bluetooth pairing/unpairing

**Acceptance Criteria:**
- Audio routes to Bluetooth headset when connected
- Audio quality acceptable for STT (>80% accuracy)
- Disconnection triggers fallback to speaker
- User sees Bluetooth status in UI

---

### FR-008: iOS Background Audio
**Status:** ADDED
**Priority:** HIGH
**Description:** App must continue audio processing when in background on iOS.

**Requirements:**
- Configure "audio" background mode in Info.plist
- Configure AVAudioSession for background playback
- Maintain LiveKit connection in background
- PTT button accessible when app is foreground
- Audio plays even when screen is locked
- Handle audio interruptions (phone calls)
- Resume audio after interruption

**Acceptance Criteria:**
- App plays audio with screen locked
- App maintains connection in background
- Phone call interruption is handled gracefully
- Audio resumes after interruption ends

---

### FR-009: Network Reconnection
**Status:** ADDED
**Priority:** HIGH
**Description:** System must handle network disconnections and reconnect automatically.

**Requirements:**
- Detect LiveKit disconnection within 3 seconds
- Auto-reconnect with exponential backoff (2s, 4s, 8s)
- Maximum reconnection attempts: 5
- Show "Reconnecting..." UI state
- Disable PTT during disconnection
- Resume normal operation after reconnection
- Handle complete network loss gracefully

**Acceptance Criteria:**
- App reconnects after 3-second network dropout
- User sees "Reconnecting" status
- PTT disabled until reconnected
- App recovers without crash or restart

---

## ADDED: User Interface Requirements

### UI-001: Single-Screen Interface
**Status:** ADDED
**Priority:** CRITICAL
**Description:** App must have minimal, distraction-free interface.

**Requirements:**
- Single main screen (no navigation)
- Dark theme (black background) for night riding
- High contrast (white/yellow on black) for sunlight readability
- Minimal visual elements (PTT button, status only)
- No scrolling required
- No keyboard input
- No complex interactions

**Acceptance Criteria:**
- App launches directly to PTT screen
- All functions accessible without navigation
- Readable in bright sunlight
- Readable at night without glare

---

### UI-002: PTT Button Design
**Status:** ADDED
**Priority:** CRITICAL
**Description:** PTT button must be easily usable with gloves.

**Requirements:**
- Button size: minimum 120x120 logical pixels
- Button located in bottom center (thumb-reachable)
- Visual states: idle, pressed, recording, thinking, speaking
- Color-coded states (e.g., idle=gray, recording=red, thinking=yellow)
- Animated during processing (subtle pulse)
- Accessible label for screen readers

**Acceptance Criteria:**
- Button is easily pressed with gloves
- Visual state is immediately clear
- Button provides haptic feedback
- States are distinguishable at a glance

---

### UI-003: Status Display
**Status:** ADDED
**Priority:** HIGH
**Description:** User must see system status at all times.

**Requirements:**
- Connection status (connected, reconnecting, disconnected)
- Bluetooth status (connected, disconnected)
- Current state (idle, listening, thinking, speaking)
- Error messages when failures occur
- Network quality indicator (optional: signal strength)
- Status updates in real-time
- Text size: minimum 16sp for readability

**Acceptance Criteria:**
- User knows if system is ready to use
- User knows if Bluetooth is connected
- User knows current processing state
- Errors are clearly communicated

---

### UI-004: Loading States
**Status:** ADDED
**Priority:** MEDIUM
**Description:** User must receive feedback during processing.

**Requirements:**
- "Listening..." indicator during audio capture
- "Thinking..." indicator during STT + LLM processing
- "Speaking..." indicator during TTS playback
- Animated spinner or pulse animation
- State changes are smooth (no jarring transitions)
- Visual indicator matches audio state

**Acceptance Criteria:**
- User knows system is processing
- User can distinguish between processing stages
- Animations are smooth and not distracting
- State transitions are clear

---

## ADDED: Error Handling Requirements

### ERR-001: API Error Handling
**Status:** ADDED
**Priority:** HIGH
**Description:** All API failures must be handled gracefully.

**Requirements:**
- Deepgram errors: show "Could not transcribe audio"
- Groq errors: show "Could not generate response"
- Cartesia errors: show "Could not speak response"
- LiveKit errors: show "Connection error"
- Rate limit errors: show "Service temporarily unavailable"
- All errors logged for debugging
- Retry logic for transient errors (network timeouts)
- User can retry failed request

**Acceptance Criteria:**
- App never crashes due to API error
- User sees clear error message
- User can retry after error
- Errors are logged for diagnosis

---

### ERR-002: Audio Error Handling
**Status:** ADDED
**Priority:** HIGH
**Description:** Audio device errors must be handled gracefully.

**Requirements:**
- Microphone permission denied: show permission request
- Microphone hardware failure: show error message
- Speaker/headphone disconnection: fallback to available output
- Bluetooth connection failure: fallback to phone speaker
- Background audio interrupted: resume after interruption
- All audio errors logged

**Acceptance Criteria:**
- App requests microphone permission
- Missing permissions show actionable message
- Hardware failures show clear error
- Audio reroutes automatically on device change

---

### ERR-003: Network Error Handling
**Status:** ADDED
**Priority:** HIGH
**Description:** Network failures must be handled without data loss.

**Requirements:**
- Network timeout: show "Request timed out, please try again"
- No network: disable PTT and show "No connection"
- Slow network: show warning "Slow connection, responses may be delayed"
- Connection loss during request: show "Connection lost, reconnecting..."
- DNS failure: show "Cannot reach service"
- All network errors logged

**Acceptance Criteria:**
- App detects network status
- User knows when offline
- PTT disabled when no network
- Reconnection is automatic

---

## ADDED: Performance Requirements

### PERF-001: Battery Consumption
**Status:** ADDED
**Priority:** MEDIUM
**Description:** App must be energy efficient for extended use.

**Requirements:**
- Battery drain < 20% per hour of active use
- Screen dims after 10 seconds of inactivity (configurable)
- Audio processing optimized for efficiency
- Network polling minimized
- Background tasks minimized when idle
- Location services disabled (not needed for MVP)

**Acceptance Criteria:**
- 1-hour test shows < 20% battery drain
- App doesn't heat up device
- Background battery usage is minimal

---

### PERF-002: Memory Usage
**Status:** ADDED
**Priority:** MEDIUM
**Description:** App must use memory efficiently.

**Requirements:**
- Memory usage < 150 MB on iOS
- Memory usage < 200 MB on Android
- No memory leaks during extended use
- Audio buffers cleared after each request
- Efficient audio frame management
- Memory profiling in development

**Acceptance Criteria:**
- Memory usage stable over 30-minute session
- No crashes due to out-of-memory
- Memory profiler shows no leaks

---

### PERF-003: App Launch Time
**Status:** ADDED
**Priority:** LOW
**Description:** App must launch quickly for urgent use.

**Requirements:**
- Launch time < 3 seconds on modern devices
- Splash screen shows during initialization
- LiveKit connection established in background
- App usable immediately after launch
- No blocking initialization

**Acceptance Criteria:**
- App launches in < 3 seconds
- User can press PTT within 3 seconds
- Connection establishes in background

---

## ADDED: Security & Privacy Requirements

### SEC-001: API Key Protection
**Status:** ADDED
**Priority:** CRITICAL
**Description:** API keys must never be exposed to client.

**Requirements:**
- All API keys stored on server (Python agent)
- Client only has LiveKit token (short-lived)
- No API keys in client code or config
- Environment variables for all secrets
- API keys never logged
- Separate keys for dev/production

**Acceptance Criteria:**
- Client code contains no API keys
- Keys stored in environment variables
- Production keys differ from development

---

### SEC-002: Audio Data Privacy
**Status:** ADDED
**Priority:** HIGH
**Description:** User audio must be handled securely.

**Requirements:**
- Audio transmitted over encrypted WebRTC (DTLS-SRTP)
- Audio not persisted on server after processing
- Transcriptions not stored (MVP - add opt-in storage later)
- LLM responses not stored (MVP - add opt-in storage later)
- Compliance with platform privacy policies
- User informed of data usage in privacy policy

**Acceptance Criteria:**
- Audio encrypted in transit
- Server deletes audio after processing
- No unencrypted audio stored
- Privacy policy updated

---

## ADDED: Platform Requirements

### PLAT-001: iOS Platform Support
**Status:** ADDED
**Priority:** CRITICAL
**Description:** App must work on iOS devices.

**Requirements:**
- Minimum iOS version: 15.0
- Support iPhone (all screen sizes)
- Support iPad (bonus, not critical)
- Dark mode support
- Optimized for notch devices
- Background audio capability
- Bluetooth audio support

**Acceptance Criteria:**
- App runs on iOS 15+
- App tested on iPhone 12 or newer
- Background audio works
- Bluetooth audio works

---

### PLAT-002: Android Platform Support
**Status:** ADDED
**Priority:** CRITICAL
**Description:** App must work on Android devices.

**Requirements:**
- Minimum Android version: 8.0 (API 26)
- Support various screen sizes
- Support various Android vendors
- Dark theme support
- Background audio capability
- Bluetooth audio support
- Handle Android fragmentation

**Acceptance Criteria:**
- App runs on Android 8.0+
- App tested on Samsung/Google Pixel
- Background audio works
- Bluetooth audio works

---

## ADDED: Development & Deployment Requirements

### DEV-001: Development Environment
**Status:** ADDED
**Priority:** CRITICAL
**Description:** Developers must be able to set up environment easily.

**Requirements:**
- Setup documentation in `docs/setup-guide.md`
- `.env.example` with all required variables
- Clear instructions for iOS setup
- Clear instructions for Android setup
- Clear instructions for Python agent setup
- Dependency management (npm, poetry)
- One-command setup script (optional)

**Acceptance Criteria:**
- New developer can set up in < 1 hour
- All dependencies documented
- Setup script works on macOS/Linux

---

### DEV-002: Testing Requirements
**Status:** ADDED
**Priority:** HIGH
**Description:** Code must be testable and tested.

**Requirements:**
- Unit tests for critical functions
- Integration tests for API handlers
- Manual testing guide for device testing
- Test coverage > 60% (stretch: 80%)
- CI/CD for automated testing (post-MVP)
- Manual test checklist in `docs/testing-guide.md`

**Acceptance Criteria:**
- Unit tests pass
- Integration tests pass
- Manual testing guide created
- Critical paths covered by tests

---

### DEP-001: Python Agent Deployment
**Status:** ADDED
**Priority:** HIGH
**Description:** Python agent must be deployable to production.

**Requirements:**
- Dockerfile for containerization
- Support deployment to Render/Railway/Fly.io
- Environment variable configuration
- Health check endpoint
- Logging to stdout (for cloud log aggregation)
- Graceful shutdown handling
- Auto-restart on crash

**Acceptance Criteria:**
- Agent deploys to chosen platform
- Agent auto-restarts on failure
- Logs accessible in platform dashboard
- Health checks pass

---

### DEP-002: Client App Distribution
**Status:** ADDED
**Priority:** MEDIUM
**Description:** Client app must be distributable for testing.

**Requirements:**
- iOS: TestFlight distribution
- Android: Internal testing track on Play Console
- Version numbering (semver)
- Release notes for each build
- Crash reporting (Sentry or similar)
- Analytics (optional for MVP)

**Acceptance Criteria:**
- iOS app on TestFlight
- Android app on Internal Testing
- Testers can install and test

---

## Removed Requirements

None - this is initial implementation.

---

## Modified Requirements

None - this is initial implementation.

---

## Change Summary

**Total Added:** 31 requirements
- Functional: 9
- User Interface: 4
- Error Handling: 3
- Performance: 3
- Security & Privacy: 2
- Platform: 2
- Development: 2
- Deployment: 2
- Audio & Communication: 4

**Total Modified:** 0

**Total Removed:** 0

---

## Approval Status

- [ ] Technical review approved
- [ ] Product review approved
- [ ] Security review approved (if applicable)
- [ ] Ready for implementation
