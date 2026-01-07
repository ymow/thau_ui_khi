# Implementation Tasks: Voice-Enabled LLM MVP

## Phase 0: Setup & Infrastructure (Week 1)

### Project Initialization
- [ ] Initialize React Native project with Expo
  - [ ] Run `npx create-expo-app client --template blank-typescript`
  - [ ] Configure TypeScript settings
  - [ ] Set up ESLint and Prettier
  - [ ] Create basic folder structure

- [ ] Initialize Python agent project
  - [ ] Create `agent/` directory
  - [ ] Set up Poetry for dependency management
  - [ ] Create `pyproject.toml` with dependencies
  - [ ] Create virtual environment
  - [ ] Set up Python linting (ruff/black)

### External Service Setup
- [ ] Create LiveKit Cloud account
  - [ ] Sign up at cloud.livekit.io
  - [ ] Create new project
  - [ ] Generate API key and secret
  - [ ] Note WebSocket URL

- [ ] Obtain Deepgram API key
  - [ ] Sign up at deepgram.com
  - [ ] Choose pay-as-you-go plan
  - [ ] Generate API key
  - [ ] Test with curl command

- [ ] Obtain Groq API key
  - [ ] Sign up at console.groq.com
  - [ ] Verify free tier access (14,400 requests/day)
  - [ ] Generate API key
  - [ ] Test with simple request

- [ ] Obtain Cartesia API key
  - [ ] Sign up at cartesia.ai
  - [ ] Generate API key
  - [ ] Review pricing and limits

### Development Environment
- [ ] Configure environment variables
  - [ ] Create `.env.example` in root
  - [ ] Create `.env` (gitignored) with actual keys
  - [ ] Document required environment variables

- [ ] Set up iOS development environment
  - [ ] Install Xcode from App Store
  - [ ] Install CocoaPods (`sudo gem install cocoapods`)
  - [ ] Configure iOS simulator
  - [ ] Test basic Expo app launch on iOS

- [ ] Set up Android development environment
  - [ ] Install Android Studio
  - [ ] Configure Android SDK
  - [ ] Create Android Virtual Device (AVD)
  - [ ] Test basic Expo app launch on Android

### Basic Connection Test
- [ ] Implement minimal LiveKit connection in client
  - [ ] Install `@livekit/react-native` package
  - [ ] Create basic connection test component
  - [ ] Test connection to LiveKit room

- [ ] Implement minimal LiveKit agent in Python
  - [ ] Install `livekit-agents` package
  - [ ] Create basic agent that joins room
  - [ ] Run agent and verify connection

- [ ] Verify end-to-end connectivity
  - [ ] Client connects to LiveKit room
  - [ ] Agent joins same room
  - [ ] Confirm both participants visible in LiveKit dashboard

---

## Phase 1: Audio Pipeline Foundation (Week 2)

### Client Audio Capture
- [ ] Implement PTT button UI
  - [ ] Create `PTTButton.tsx` component
  - [ ] Add touch handlers (onPressIn, onPressOut)
  - [ ] Add visual feedback (pressed state)
  - [ ] Add haptic feedback

- [ ] Configure audio session
  - [ ] Request microphone permissions
  - [ ] Configure AVAudioSession for iOS
  - [ ] Configure AudioManager for Android
  - [ ] Handle permission denied state

- [ ] Implement audio capture on PTT press
  - [ ] Start microphone capture on button press
  - [ ] Create local audio track in LiveKit room
  - [ ] Publish audio track to room
  - [ ] Stop capture on button release

### Agent Audio Reception
- [ ] Implement audio track reception in agent
  - [ ] Subscribe to participant audio tracks
  - [ ] Handle track subscribed event
  - [ ] Receive audio frames
  - [ ] Log audio frame metadata (format, sample rate)

### Echo Test Implementation
- [ ] Create echo agent for validation
  - [ ] Receive audio frames from client
  - [ ] Buffer audio frames
  - [ ] Publish same audio back to client
  - [ ] Test: press PTT, speak, hear echo

### Client Audio Playback
- [ ] Implement audio playback
  - [ ] Subscribe to agent's audio track
  - [ ] Configure audio output (speaker/Bluetooth)
  - [ ] Play received audio frames
  - [ ] Handle audio interruptions

### UI Polish
- [ ] Add status indicators
  - [ ] Connection status (connected/disconnected)
  - [ ] Audio capture status (recording/idle)
  - [ ] Audio playback status (playing/idle)
  - [ ] Create `StatusDisplay.tsx` component

---

## Phase 2: STT Integration (Week 3)

### Deepgram Integration
- [ ] Install Deepgram SDK in Python agent
  - [ ] Add `deepgram-sdk` to dependencies
  - [ ] Import and initialize Deepgram client
  - [ ] Configure API key from environment

- [ ] Create STT handler module
  - [ ] Create `agent/src/pipeline/stt_handler.py`
  - [ ] Implement `DeepgramSTTHandler` class
  - [ ] Add audio format conversion utilities
  - [ ] Add error handling

### Audio Format Conversion
- [ ] Convert LiveKit audio frames to Deepgram format
  - [ ] Extract raw audio data from frames
  - [ ] Convert sample rate if needed (16kHz target)
  - [ ] Convert to correct encoding (LINEAR16)
  - [ ] Handle multi-channel to mono conversion

### API Integration
- [ ] Send audio to Deepgram API
  - [ ] Use batch API (full audio, not streaming)
  - [ ] Configure model: nova-2
  - [ ] Enable punctuation
  - [ ] Set language: en-US (or user's language)

- [ ] Receive and process transcription
  - [ ] Extract transcription text from response
  - [ ] Log transcription with confidence score
  - [ ] Handle empty transcription (silence detected)
  - [ ] Handle API errors (rate limit, invalid audio, etc.)

### Testing & Validation
- [ ] Test STT accuracy
  - [ ] Test with clear speech in quiet environment
  - [ ] Test with background noise
  - [ ] Test with multiple speakers
  - [ ] Measure transcription latency

- [ ] Create unit tests
  - [ ] Test audio format conversion
  - [ ] Test Deepgram API error handling
  - [ ] Mock API responses for testing

---

## Phase 3: LLM Integration (Week 3-4)

### Groq Integration
- [ ] Install Groq SDK in Python agent
  - [ ] Add `groq` to dependencies
  - [ ] Import and initialize Groq client
  - [ ] Configure API key from environment

- [ ] Create LLM handler module
  - [ ] Create `agent/src/pipeline/llm_handler.py`
  - [ ] Implement `GroqLLMHandler` class
  - [ ] Add prompt template management
  - [ ] Add error handling

### Prompt Engineering
- [ ] Design system prompt for driving context
  - [ ] Create `agent/src/config/prompts.py`
  - [ ] Define concise response requirement
  - [ ] Add safety warnings (avoid distractions)
  - [ ] Add examples of good responses
  - [ ] Test prompt variations

- [ ] Implement prompt templating
  - [ ] Create system message
  - [ ] Create user message from transcription
  - [ ] Handle conversation context (future: multi-turn)

### API Integration
- [ ] Send transcription to Groq API
  - [ ] Use chat completions endpoint
  - [ ] Configure model: llama3-70b-8192
  - [ ] Set temperature and max tokens
  - [ ] Add request timeout (10s)

- [ ] Receive and process LLM response
  - [ ] Extract response text
  - [ ] Log response with token count
  - [ ] Validate response length
  - [ ] Handle API errors (rate limit, timeout, etc.)

### Testing & Validation
- [ ] Test LLM responses
  - [ ] Test various question types
  - [ ] Verify response conciseness
  - [ ] Measure response latency
  - [ ] Test error handling

- [ ] Create unit tests
  - [ ] Test prompt formatting
  - [ ] Test Groq API error handling
  - [ ] Mock API responses for testing

---

## Phase 4: TTS Integration (Week 4)

### Cartesia Integration
- [ ] Install Cartesia SDK in Python agent
  - [ ] Add `cartesia` to dependencies
  - [ ] Import and initialize Cartesia client
  - [ ] Configure API key from environment

- [ ] Create TTS handler module
  - [ ] Create `agent/src/pipeline/tts_handler.py`
  - [ ] Implement `CartesiaTTSHandler` class
  - [ ] Add audio format conversion utilities
  - [ ] Add error handling

### API Integration
- [ ] Send LLM text to Cartesia API
  - [ ] Use TTS endpoint
  - [ ] Configure voice: sonic (or preferred voice)
  - [ ] Set sample rate: 16kHz (or LiveKit compatible)
  - [ ] Request streaming if available

- [ ] Receive and process audio
  - [ ] Extract audio data from response
  - [ ] Convert to LiveKit audio frame format
  - [ ] Handle audio chunk streaming
  - [ ] Handle API errors

### Audio Playback Pipeline
- [ ] Publish TTS audio to LiveKit room
  - [ ] Create agent audio track
  - [ ] Publish audio frames
  - [ ] Ensure proper timing and buffering
  - [ ] Handle playback completion

- [ ] Client receives and plays audio
  - [ ] Subscribe to agent audio track
  - [ ] Play audio through speaker/Bluetooth
  - [ ] Add visual indicator (speaking state)
  - [ ] Handle playback interruptions

### End-to-End Integration
- [ ] Connect STT → LLM → TTS pipeline
  - [ ] Create main agent orchestration logic
  - [ ] Handle pipeline state transitions
  - [ ] Add logging at each stage
  - [ ] Measure total latency

### Testing & Validation
- [ ] Test full conversation loop
  - [ ] Press PTT, speak question
  - [ ] Verify transcription
  - [ ] Verify LLM response generation
  - [ ] Verify TTS audio playback
  - [ ] Measure end-to-end latency

- [ ] Test edge cases
  - [ ] Empty audio (silence)
  - [ ] Very long speech (>30s)
  - [ ] Rapid repeated requests
  - [ ] API failures at each stage

---

## Phase 5: Polish & Resilience (Week 5)

### UI/UX Improvements
- [ ] Add loading states
  - [ ] Create `LoadingIndicator.tsx` component
  - [ ] Show "Listening..." state during STT
  - [ ] Show "Thinking..." state during LLM
  - [ ] Show "Speaking..." state during TTS
  - [ ] Add animations for smooth transitions

- [ ] Improve visual design
  - [ ] High-contrast dark theme for riding
  - [ ] Large touch targets for gloved hands
  - [ ] Minimal distractions (no unnecessary UI)
  - [ ] Clear error messages

- [ ] Add haptic feedback
  - [ ] Vibrate on PTT press
  - [ ] Vibrate on response start
  - [ ] Different patterns for success/error

### Network Resilience
- [ ] Implement reconnection logic
  - [ ] Detect LiveKit disconnection
  - [ ] Auto-reconnect with exponential backoff
  - [ ] Show reconnecting UI state
  - [ ] Resume conversation after reconnect

- [ ] Add network monitoring
  - [ ] Install `@react-native-community/netinfo`
  - [ ] Monitor network type (WiFi/4G/5G)
  - [ ] Show warning on weak connection
  - [ ] Disable PTT when offline

### Bluetooth Audio Support
- [ ] Configure Bluetooth HFP routing
  - [ ] iOS: Configure AVAudioSession for Bluetooth
  - [ ] Android: Configure AudioManager for Bluetooth
  - [ ] Detect Bluetooth device connection
  - [ ] Auto-route audio to Bluetooth when connected

- [ ] Handle Bluetooth disconnection
  - [ ] Detect disconnection event
  - [ ] Fallback to phone speaker
  - [ ] Show UI notification

### iOS Background Audio
- [ ] Configure iOS background modes
  - [ ] Add "audio" background mode to Info.plist
  - [ ] Configure AVAudioSession category
  - [ ] Test with screen lock
  - [ ] Test with app switch

- [ ] Handle audio interruptions
  - [ ] Phone call interruption
  - [ ] Other app audio interruption
  - [ ] Resume audio after interruption

### Error Handling
- [ ] Add comprehensive error handling
  - [ ] Network errors (timeout, no connection)
  - [ ] API errors (rate limit, authentication, server error)
  - [ ] Audio errors (permission denied, device busy)
  - [ ] Microphone errors (hardware failure)

- [ ] User-friendly error messages
  - [ ] Show toast/alert with error description
  - [ ] Provide actionable suggestions
  - [ ] Log errors for debugging
  - [ ] Implement retry logic

### Testing on Real Devices
- [ ] iOS device testing
  - [ ] Install on physical iPhone
  - [ ] Test with Bluetooth headphones
  - [ ] Test with screen lock
  - [ ] Test during navigation

- [ ] Android device testing
  - [ ] Install on physical Android phone
  - [ ] Test with Bluetooth headphones
  - [ ] Test with screen lock
  - [ ] Test during navigation

- [ ] Motorcycle helmet testing
  - [ ] Test with Bluetooth helmet system
  - [ ] Test at various speeds (noise levels)
  - [ ] Test with wind noise
  - [ ] Measure transcription accuracy in real conditions

### Performance Optimization
- [ ] Measure and optimize latency
  - [ ] Add latency tracking at each stage
  - [ ] Log P50, P95, P99 latencies
  - [ ] Identify and fix bottlenecks
  - [ ] Target: <2s P95 end-to-end

- [ ] Measure battery usage
  - [ ] Test battery drain during 1 hour of use
  - [ ] Optimize audio processing
  - [ ] Optimize network usage
  - [ ] Target: <20% drain per hour

### Documentation
- [ ] Create setup guide
  - [ ] Document development environment setup
  - [ ] Document API key configuration
  - [ ] Document iOS/Android build process
  - [ ] Document testing procedures

- [ ] Create deployment guide
  - [ ] Document Python agent deployment
  - [ ] Document client app distribution (TestFlight/Play Console)
  - [ ] Document monitoring and logging setup

- [ ] Update AGENTS.md
  - [ ] Document voice interface workflow
  - [ ] Add troubleshooting guide
  - [ ] Add FAQ section

---

## Post-Implementation

### Code Quality
- [ ] Code review
  - [ ] Review client code
  - [ ] Review agent code
  - [ ] Check for security issues
  - [ ] Check for performance issues

- [ ] Add tests
  - [ ] Unit tests for critical functions
  - [ ] Integration tests for pipeline
  - [ ] End-to-end tests

### Deployment Preparation
- [ ] Set up production LiveKit instance (if not using Cloud)
- [ ] Set up production Python agent hosting
  - [ ] Choose hosting provider (Render, Railway, Fly.io)
  - [ ] Configure environment variables
  - [ ] Set up continuous deployment
  - [ ] Configure monitoring and alerts

- [ ] Prepare client app for distribution
  - [ ] iOS: Create App Store Connect listing
  - [ ] iOS: Submit for TestFlight
  - [ ] Android: Create Play Console listing
  - [ ] Android: Create internal testing track

### Handoff
- [ ] Create demo video
- [ ] Write user guide
- [ ] Create troubleshooting guide
- [ ] Document known issues and limitations
- [ ] Document post-MVP roadmap

---

## Success Checklist

### Functional Requirements
- [ ] User can press PTT button and speak
- [ ] Speech is transcribed with >80% accuracy in moderate noise
- [ ] LLM generates contextually appropriate response
- [ ] Response is spoken back through TTS
- [ ] End-to-end latency <2s (P95)
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Works with Bluetooth audio
- [ ] Works in background (iOS)
- [ ] Survives network disconnection and reconnection

### Non-Functional Requirements
- [ ] App doesn't crash during 10-minute session
- [ ] Battery drain <20% per hour
- [ ] Clear error states and messages
- [ ] Simple one-screen interface
- [ ] Usable with gloves (large touch targets)
- [ ] Readable in bright sunlight (high contrast)

---

## Notes

- Tasks marked with [ ] are pending
- Tasks marked with [x] are completed
- Update this file as tasks are completed
- Add sub-tasks as needed during implementation
- Note any blockers or issues in separate issues.md file
