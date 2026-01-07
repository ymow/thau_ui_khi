# Quick Start Guide - Phase 1

Get the Voice LLM echo test running in 15 minutes.

## Prerequisites

- LiveKit Cloud account: https://cloud.livekit.io/
- Python 3.11+
- Node.js 18+
- iOS/Android development environment

---

## Step 1: Clone and Configure (5 min)

```bash
# Clone repository
git clone <repo-url>
cd thau_ui_khi

# Copy environment template
cp .env.example .env
```

Edit `.env` with your LiveKit credentials:
```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=API******
LIVEKIT_API_SECRET=*************
```

---

## Step 2: Install LiveKit CLI (2 min)

### macOS
```bash
brew install livekit-cli
```

### Linux
```bash
curl -sSL https://get.livekit.io/cli | bash
```

### Authenticate
```bash
lk cloud auth
```

---

## Step 3: Start Agent (3 min)

```bash
cd agent

# Install dependencies
pip install -r requirements.txt

# Run agent locally
python -m livekit.agents.cli start src.agent
```

You should see: "Agent ready and listening for audio"

---

## Step 4: Run Client App (5 min)

### Option A: iOS

```bash
cd client
npm install
npm run ios
```

### Option B: Android

```bash
cd client
npm install
npm run android
```

---

## Step 5: Test Echo (1 min)

1. App should show "Connected" status
2. Press and hold the big button
3. Say "Testing one two three"
4. Release button
5. You should hear your voice echoed back!

---

## Troubleshooting

### "Token generation not implemented"

The client needs a token. Generate one:

```bash
lk token create --room voice-test --identity user-1
```

Copy the token and temporarily paste it in:
`client/src/services/LiveKitService.ts` line 48

### Agent won't start

Check environment variables:
```bash
cd agent
python -c "from src.config.settings import settings; settings.validate()"
```

### No audio

1. Check microphone permissions on device
2. Check agent logs for errors
3. Try with headphones

---

## What's Working (Phase 1)

✅ LiveKit Cloud connection
✅ Push-to-talk button
✅ Audio capture from microphone
✅ Audio transmission to agent
✅ Audio echo back from agent
✅ Audio playback through speaker

## What's Next (Phase 2)

🔜 Speech-to-text (Deepgram)
🔜 LLM generation (Groq)
🔜 Text-to-speech (Cartesia)
🔜 Full conversation flow

---

## Need Help?

- Full setup: `/docs/livekit-setup.md`
- Testing guide: `/docs/testing-guide.md`
- Deployment: `/docs/deployment.md`

---

## Deploy to Production

Once echo test works:

```bash
# Deploy agent to LiveKit Cloud
cd agent
lk agent create
lk agent deploy

# Check status
lk agent list
lk agent logs voice-llm-agent
```

See `/docs/livekit-setup.md` for complete production setup.
