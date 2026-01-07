# Testing Guide

Comprehensive guide for testing the Voice-Enabled LLM application across different phases and scenarios.

## Testing Philosophy

Testing is organized by implementation phase:
- **Phase 1**: Audio pipeline (echo test)
- **Phase 2**: STT integration (transcription validation)
- **Phase 3**: LLM integration (response quality)
- **Phase 4**: TTS integration (voice output)
- **Phase 5**: End-to-end integration (real-world scenarios)

---

## Testing Environment Setup

### Prerequisites

- Development environment set up (see `setup-guide.md`)
- Physical iOS/Android device (recommended for audio testing)
- Bluetooth audio device (for Phase 5)
- Quiet testing environment (for baseline tests)

### Test API Keys

Ensure all API keys are configured and working:

```bash
# Test from agent directory
cd agent
poetry run python -c "from src.config.settings import settings; settings.validate()"
# Should print nothing if successful
```

---

## Phase 1: Audio Pipeline Testing

**Goal**: Verify audio capture, transmission, and playback

### Test 1.1: Basic Connection

**Expected**: Client connects to LiveKit room, agent joins room

```bash
# Terminal 1: Start agent
cd agent
poetry run python src/agent.py

# Terminal 2: Start client
cd client
npm start
# Launch on device/simulator
```

**Success Criteria:**
- [ ] Client shows "Connected" status
- [ ] Agent logs show "Participant joined"
- [ ] LiveKit dashboard shows both participants in room

### Test 1.2: Audio Capture

**Expected**: PTT button captures audio

**Steps:**
1. Press and hold PTT button
2. Speak into microphone
3. Release button
4. Check logs for audio frames

**Success Criteria:**
- [ ] Button changes to "Recording" state
- [ ] Client logs show audio frames being captured
- [ ] Audio frames are published to LiveKit room

### Test 1.3: Echo Test

**Expected**: Hear your own voice echoed back

**Steps:**
1. Press PTT button
2. Say "Testing one two three"
3. Release button
4. Listen for echo playback

**Success Criteria:**
- [ ] Audio is echoed back within 1 second
- [ ] Audio quality is recognizable
- [ ] No crashes or errors

### Test 1.4: Multiple Requests

**Expected**: System handles repeated requests

**Steps:**
1. Press PTT and speak (wait for echo)
2. Repeat 5 times with different phrases
3. Observe for memory leaks or slowdowns

**Success Criteria:**
- [ ] All 5 requests complete successfully
- [ ] Latency remains consistent
- [ ] Memory usage stays stable

---

## Phase 2: STT Testing

**Goal**: Verify speech-to-text accuracy

### Test 2.1: Clear Speech

**Test Cases:**
```
1. "Hello, how are you today?"
2. "What's the weather like?"
3. "Navigate to the nearest gas station"
4. "Call my wife"
5. "What time is it?"
```

**Success Criteria:**
- [ ] Accuracy > 95% in quiet environment
- [ ] Transcription completes within 500ms
- [ ] Proper punctuation and capitalization

### Test 2.2: Noisy Environment

**Setup:** Play background noise (engine sound, wind, traffic)

**Test Cases:**
```
1. "Can you hear me clearly?"
2. "What's the traffic situation ahead?"
```

**Success Criteria:**
- [ ] Accuracy > 80% with moderate noise (60-70 dB)
- [ ] Major words transcribed correctly
- [ ] No crashes due to poor audio quality

### Test 2.3: Edge Cases

**Test Cases:**
```
1. [Silence] - Press PTT but don't speak
2. [Very short] - "Hi"
3. [Very long] - Speak continuously for 20 seconds
4. [Mumbling] - Speak unclearly
5. [Fast speech] - Speak very quickly
```

**Success Criteria:**
- [ ] Silence returns empty transcription (not error)
- [ ] Short speech transcribed correctly
- [ ] Long speech transcribed completely
- [ ] Unclear speech handled gracefully
- [ ] Fast speech mostly transcribed

### Test 2.4: Error Handling

**Test Cases:**
1. Disconnect network during transcription
2. Send invalid audio format
3. Exceed Deepgram rate limit

**Success Criteria:**
- [ ] Network errors show user-friendly message
- [ ] Invalid audio returns clear error
- [ ] Rate limit triggers retry logic

---

## Phase 3: LLM Testing

**Goal**: Verify LLM response quality and conciseness

### Test 3.1: Question Types

**Test Cases:**
```
1. Factual: "What is the capital of France?"
2. Calculation: "What's 25 times 4?"
3. Advice: "Should I take the highway or backroads?"
4. Weather: "What's the weather forecast?"
5. General: "Tell me something interesting"
```

**Success Criteria:**
- [ ] Responses are factually correct
- [ ] Responses are 1-3 sentences
- [ ] Responses use conversational language
- [ ] Responses complete within 400ms (P95)

### Test 3.2: Safety & Distraction

**Test Cases:**
```
1. "Write me a detailed essay about quantum physics"
2. "List all the presidents of the United States"
3. "Show me a chart of stock prices"
```

**Success Criteria:**
- [ ] Long-form requests return concise summaries
- [ ] Lists are converted to sentences or declined
- [ ] Visual requests are handled appropriately

### Test 3.3: Context Appropriateness

**Test Cases:**
```
1. "I'm feeling tired while driving"
2. "Should I check my phone?"
3. "How do I change the oil?"
```

**Success Criteria:**
- [ ] Safety concerns prioritized
- [ ] Dangerous actions discouraged
- [ ] Complex tasks deferred ("Pull over first")

---

## Phase 4: TTS Testing

**Goal**: Verify natural-sounding speech output

### Test 4.1: Voice Quality

**Test Cases:**
```
1. Short: "Okay"
2. Medium: "The weather today is sunny with a high of 75 degrees."
3. Long: "According to recent research, electric vehicles are becoming increasingly popular due to environmental concerns and lower operating costs."
```

**Success Criteria:**
- [ ] Voice sounds natural (not robotic)
- [ ] Proper pronunciation of common words
- [ ] Appropriate pauses for punctuation
- [ ] First audio arrives within 600ms

### Test 4.2: Special Cases

**Test Cases:**
```
1. Numbers: "The answer is 42."
2. Dates: "Today is January 7th, 2026."
3. URLs: "Visit example.com for more information."
4. Abbreviations: "The US GDP is growing."
```

**Success Criteria:**
- [ ] Numbers pronounced correctly
- [ ] Dates pronounced naturally
- [ ] URLs handled appropriately
- [ ] Abbreviations expanded correctly

### Test 4.3: Playback Quality

**Test Scenarios:**
1. Through phone speaker
2. Through Bluetooth headset (HFP)
3. Through wired headphones

**Success Criteria:**
- [ ] Audio quality acceptable on all outputs
- [ ] Volume level appropriate
- [ ] No distortion or clipping
- [ ] Bluetooth audio works (even if reduced quality)

---

## Phase 5: End-to-End Testing

**Goal**: Real-world scenario validation

### Test 5.1: Complete Conversation Flow

**Scenario**: Ask a question and receive response

**Steps:**
1. Launch app
2. Press PTT button
3. Ask: "What's the capital of France?"
4. Release button
5. Listen for response

**Success Criteria:**
- [ ] End-to-end latency < 2s (P95)
- [ ] Response is "Paris" or equivalent
- [ ] Voice quality is acceptable
- [ ] No errors or crashes

### Test 5.2: Network Resilience

**Scenario**: Simulate network dropout

**Steps:**
1. Start a conversation
2. Turn on Airplane mode briefly (3 seconds)
3. Turn off Airplane mode
4. Continue conversation

**Success Criteria:**
- [ ] App shows "Reconnecting..." status
- [ ] Auto-reconnects within 5 seconds
- [ ] Next request works normally
- [ ] No crash or freeze

### Test 5.3: Bluetooth Audio

**Equipment**: Bluetooth helmet system or headset

**Steps:**
1. Pair Bluetooth device
2. Launch app (should auto-route to Bluetooth)
3. Press PTT and speak
4. Verify audio input and output through Bluetooth

**Success Criteria:**
- [ ] Audio routes to Bluetooth automatically
- [ ] Microphone input works
- [ ] Speaker output works
- [ ] HFP bandwidth limitation handled gracefully

### Test 5.4: Background Audio (iOS)

**Steps:**
1. Start conversation
2. Lock screen
3. Press PTT button (if accessible via hardware)
4. Or wait for response to previous question

**Success Criteria:**
- [ ] Audio continues playing with screen locked
- [ ] App maintains LiveKit connection
- [ ] Audio resumes after phone call interruption

### Test 5.5: Real-World Motorcycle Test

**Equipment**: Motorcycle, Bluetooth helmet, app on phone

**Safety**: Test in safe conditions (e.g., parking lot first)

**Steps:**
1. Mount phone on motorcycle
2. Connect Bluetooth helmet
3. Start engine (introduces noise)
4. Ride at various speeds (0, 30, 60, 100 km/h)
5. Test conversation at each speed

**Test Questions:**
```
1. "What's the current time?"
2. "How far to the nearest gas station?"
3. "What's the weather forecast?"
```

**Success Criteria:**
- [ ] App remains connected during ride
- [ ] Transcription accuracy > 80% at 30 km/h
- [ ] Transcription accuracy > 70% at 60 km/h
- [ ] System usable at speeds up to 100 km/h
- [ ] Wind noise doesn't cause false triggers
- [ ] Audio output is intelligible through helmet

---

## Performance Testing

### Latency Benchmarks

**Method**: Add timing logs to track each stage

```typescript
// Client side
const startTime = Date.now();
// ... after response received
const endTime = Date.now();
console.log(`Total latency: ${endTime - startTime}ms`);
```

**Targets:**
- P50 latency: < 1.5s
- P95 latency: < 2.0s
- Timeout: 15s

**Measurements:**
Run 20 requests and calculate percentiles:
```
Request 1: 1234ms
Request 2: 1567ms
...
Request 20: 1345ms

P50 (median): ____ms
P95: ____ms
Max: ____ms
```

### Battery Consumption

**Method**: Start with 100% battery, use app for 1 hour

**Test Scenario:**
- Send 30 requests (one every 2 minutes)
- Keep app in foreground
- Screen brightness: 50%

**Target**: < 20% battery drain per hour

**Measurement:**
```
Start: 100%
After 1 hour: ____%
Drain: ____%
```

### Memory Usage

**Method**: Use Xcode Instruments (iOS) or Android Profiler

**Test**: Run app for 30 minutes with requests every 2 minutes

**Targets:**
- iOS: < 150 MB
- Android: < 200 MB
- No memory leaks (stable over time)

---

## Bug Reporting

When you find a bug, report with:

1. **Title**: Short description
2. **Severity**: Critical / High / Medium / Low
3. **Phase**: Which phase of testing
4. **Device**: iOS/Android version and model
5. **Steps to reproduce**:
   - Step 1
   - Step 2
   - Step 3
6. **Expected behavior**
7. **Actual behavior**
8. **Logs**: Relevant console output
9. **Screenshots/Video**: If applicable

---

## Test Completion Checklist

### Phase 1: Audio Pipeline
- [ ] Basic connection works
- [ ] Audio capture works
- [ ] Echo test passes
- [ ] Multiple requests handled

### Phase 2: STT
- [ ] Clear speech > 95% accuracy
- [ ] Noisy environment > 80% accuracy
- [ ] Edge cases handled
- [ ] Error handling works

### Phase 3: LLM
- [ ] Responses are accurate
- [ ] Responses are concise (1-3 sentences)
- [ ] Safety-appropriate responses
- [ ] Context awareness

### Phase 4: TTS
- [ ] Natural voice quality
- [ ] Special cases handled
- [ ] Playback quality acceptable
- [ ] Bluetooth output works

### Phase 5: End-to-End
- [ ] Complete flow < 2s (P95)
- [ ] Network resilience works
- [ ] Bluetooth audio works
- [ ] iOS background audio works
- [ ] Real motorcycle test passes

### Performance
- [ ] Latency targets met
- [ ] Battery consumption < 20%/hour
- [ ] Memory usage stable
- [ ] No crashes in 1-hour session

---

## Next Steps After Testing

1. Document all bugs found
2. Prioritize bug fixes
3. Re-test after fixes
4. Prepare for alpha user testing
5. Create user testing feedback form
