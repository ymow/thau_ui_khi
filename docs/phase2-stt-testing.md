# Phase 2: STT Testing Guide

Complete guide for testing Speech-to-Text integration with Deepgram Nova-2.

## What's New in Phase 2

Phase 2 adds speech-to-text transcription using Deepgram Nova-2:

- ✅ Audio frame buffering
- ✅ Deepgram Nova-2 integration
- ✅ Real-time transcription
- ✅ Audio format conversion utilities
- ✅ Transcription logging

## Prerequisites

- Phase 1 setup complete (LiveKit Cloud connected)
- Deepgram API key (sign up at https://deepgram.com/)
- Agent and client from Phase 1

---

## Setup

### 1. Get Deepgram API Key

1. Sign up at https://console.deepgram.com/signup
2. Go to API Keys section
3. Create a new API key
4. Copy the key

### 2. Configure Environment

Add to `.env`:
```bash
DEEPGRAM_API_KEY=your-deepgram-api-key-here
```

### 3. Install Dependencies

```bash
cd agent
pip install -r requirements.txt
# This will install numpy and updated deepgram-sdk
```

---

## Running Phase 2

### Enable STT Mode

The agent has a flag to switch between echo (Phase 1) and STT (Phase 2):

Edit `agent/src/agent.py` line 34:
```python
# Set to True for Phase 2 (STT), False for Phase 1 (echo)
ENABLE_STT = True
```

### Start Agent

```bash
cd agent
python -m livekit.agents.cli start src.agent
```

You should see:
```
INFO - STT handler initialized
INFO - VoiceAgent initialized
INFO - Agent ready - audio track published
```

### Start Client

```bash
cd client
npm start
# Then run on iOS or Android
```

---

## Testing Transcription

### Test 1: Clear Speech

**Steps:**
1. Press and hold PTT button
2. Say clearly: "Hello, how are you today?"
3. Release button
4. Check agent logs

**Expected Output:**
```
INFO - Buffered audio frame: 1 frames
INFO - Buffered audio frame: 2 frames
...
INFO - Audio stream ended, processing buffered audio...
INFO - Transcribing audio: 32768 bytes, 2.05s
INFO - Transcription successful: 'Hello, how are you today?' (confidence: 0.98)
INFO - 📝 Transcription: "Hello, how are you today?"
```

**Success Criteria:**
- [ ] Transcription is accurate (matches what you said)
- [ ] Confidence > 0.90
- [ ] Latency < 1 second from button release
- [ ] No errors in logs

### Test 2: Short Utterances

**Test Cases:**
```
1. "Hi"
2. "Okay"
3. "Yes"
4. "No"
5. "Thank you"
```

**Success Criteria:**
- [ ] All short words transcribed correctly
- [ ] No timeout errors
- [ ] Confidence > 0.85

### Test 3: Longer Sentences

**Test Cases:**
```
1. "What's the weather like today in San Francisco?"
2. "Can you tell me how to get to the nearest gas station?"
3. "I need to know the current time and date please."
```

**Success Criteria:**
- [ ] Full sentences transcribed correctly
- [ ] Punctuation included
- [ ] Capitalization correct
- [ ] Latency < 1.5 seconds

### Test 4: Silence Detection

**Steps:**
1. Press PTT button
2. Don't speak (just silence)
3. Release after 2 seconds
4. Check logs

**Expected Output:**
```
INFO - Transcribing audio: 16384 bytes, 1.02s
INFO - No speech detected (silence)
INFO - 📝 Transcription: ""
```

**Success Criteria:**
- [ ] Returns empty string (not error)
- [ ] No crash or exception
- [ ] Agent remains ready

### Test 5: Background Noise

**Setup:** Play background noise (music, traffic, etc.)

**Test Cases:**
```
1. "Testing one two three" (with moderate noise)
2. "Can you hear me clearly?" (with loud noise)
```

**Expected:**
- Moderate noise (60-70 dB): Accuracy > 80%
- Loud noise (80+ dB): May have errors but shouldn't crash

**Success Criteria:**
- [ ] Main words transcribed in moderate noise
- [ ] No crashes with loud noise
- [ ] Graceful degradation

---

## Verifying Latency

### Measure Transcription Time

Check agent logs for:
```
INFO - Transcribing audio: X bytes, Y.YYs
INFO - Transcription successful: '...' (confidence: 0.XX)
```

Time between these two lines = Deepgram latency

**Target:** < 500ms for typical 3-second audio

### Full Pipeline Latency

Phase 2 latency breakdown:
```
User releases button:         0ms
Audio buffering complete:     +50ms
Send to Deepgram:            +100ms (network)
Deepgram processing:         +300ms
Receive transcription:       +100ms (network)
Log transcription:           +50ms
─────────────────────────────────
Total:                       ~600ms
```

**Target:** < 1 second from button release to transcription logged

---

## Troubleshooting

### "DEEPGRAM_API_KEY not set"

**Problem:** Agent fails to start with this error

**Solution:**
```bash
# Check .env file exists
cat .env | grep DEEPGRAM

# Verify environment variable is loaded
cd agent
python -c "from src.config.settings import settings; print(settings.DEEPGRAM_API_KEY)"
```

### "No transcription found in Deepgram response"

**Problem:** API returns empty response

**Possible Causes:**
1. Audio too short (< 0.5s)
2. Only silence in audio
3. Invalid audio format

**Solution:**
- Speak longer (>1 second)
- Check microphone is working
- Check agent logs for audio duration

### Low Confidence Scores (< 0.70)

**Problem:** Transcriptions have low confidence

**Possible Causes:**
1. Background noise
2. Unclear speech
3. Microphone quality poor

**Solution:**
- Test in quiet environment
- Speak clearly and slowly
- Check microphone quality
- Try different microphone/headset

### High Latency (> 2s)

**Problem:** Transcription takes too long

**Possible Causes:**
1. Slow network connection
2. Large audio file (>10 seconds)
3. Deepgram API slow

**Solution:**
- Check network speed
- Keep utterances < 5 seconds
- Check Deepgram status page

### Audio Quality Issues

**Problem:** Transcriptions are frequently wrong

**Debug Steps:**
```bash
# Check audio duration is correct
# In agent logs, look for:
INFO - Transcribing audio: X bytes, Y.YYs

# Calculate expected duration:
# Duration (s) = bytes / (sample_rate * channels * bytes_per_sample)
# Duration (s) = bytes / (16000 * 1 * 2)
```

---

## Monitoring Deepgram Usage

### Check API Usage

1. Go to https://console.deepgram.com/
2. Navigate to Usage section
3. Monitor:
   - Requests per day
   - Audio minutes processed
   - Costs

### Cost Estimation

**Deepgram Nova-2 Pricing:** ~$0.0043/minute

**Example Usage:**
- 10 requests/day × 3 seconds each = 30 seconds/day
- 30 seconds × 30 days = 15 minutes/month
- 15 minutes × $0.0043 = **$0.065/month**

**MVP Testing (100 requests/day):**
- 100 requests × 3 seconds = 300 seconds/day
- 300 seconds × 30 days = 150 minutes/month
- 150 minutes × $0.0043 = **$0.65/month**

### Set Usage Alerts

In Deepgram console:
1. Go to Settings
2. Set up usage alerts
3. Get notified at 80% of budget

---

## Phase 2 Success Criteria

Before moving to Phase 3:

### Functional
- [x] STT handler created
- [x] Deepgram integration working
- [x] Audio buffering implemented
- [x] Transcription logged successfully
- [ ] Accuracy > 95% in quiet environment
- [ ] Accuracy > 80% in moderate noise
- [ ] Latency < 1 second (P95)
- [ ] Handles silence gracefully
- [ ] No crashes during testing

### Technical
- [x] Audio format conversion working
- [x] Error handling implemented
- [x] Logging comprehensive
- [ ] Memory usage stable (no leaks)
- [ ] Works on both iOS and Android

### Performance
- [ ] Transcription latency < 500ms
- [ ] Total pipeline < 1s
- [ ] Confidence scores > 0.85 (average)
- [ ] No timeout errors

---

## Switching Back to Phase 1 (Echo Test)

If you need to test Phase 1 again:

Edit `agent/src/agent.py` line 34:
```python
ENABLE_STT = False  # Back to echo mode
```

Restart agent:
```bash
python -m livekit.agents.cli start src.agent
```

---

## Next Steps: Phase 3 - LLM Integration

After Phase 2 STT is working:

1. **Integrate Groq API** for LLM responses
2. **Create LLM handler** (`agent/src/pipeline/llm_handler.py`)
3. **Update agent** to send transcription to LLM
4. **Implement prompt engineering** for driving context
5. **Handle LLM errors** gracefully
6. **Test response quality**

Target for Phase 3:
- Transcription → LLM → Text response
- Still logging (no TTS yet)
- Latency: < 600ms for LLM

---

## Debugging Commands

```bash
# Check Deepgram API key validity
curl -X POST https://api.deepgram.com/v1/listen \
  -H "Authorization: Token $DEEPGRAM_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"url": "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav"}' \
  | jq

# Test with sample audio
python -c "
from src.pipeline.stt_handler import DeepgramSTTHandler
import asyncio

async def test():
    handler = DeepgramSTTHandler()
    # Test with empty bytes (should handle gracefully)
    result = await handler.transcribe(b'')
    print(f'Result: {result}')

asyncio.run(test())
"

# Monitor agent logs in real-time
cd agent
python -m livekit.agents.cli start src.agent | tee agent.log
```

---

## Support

- **Deepgram Docs**: https://developers.deepgram.com/
- **Deepgram Discord**: https://discord.gg/deepgram
- **Project Docs**: `/docs/`
- **Testing Guide**: `/docs/testing-guide.md`

---

## Phase 2 File Checklist

Created/Modified:
- [x] `agent/src/pipeline/stt_handler.py` - Deepgram integration
- [x] `agent/src/utils/audio_utils.py` - Audio conversion
- [x] `agent/src/utils/logger.py` - Logging setup
- [x] `agent/src/agent.py` - Updated with STT
- [x] `agent/requirements.txt` - Added numpy
- [x] `agent/pyproject.toml` - Added numpy
- [x] `docs/phase2-stt-testing.md` - This guide

Ready for testing!
