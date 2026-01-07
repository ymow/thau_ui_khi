# LiveKit Cloud Setup Guide

Complete guide for setting up and deploying the Voice LLM agent to LiveKit Cloud.

## Prerequisites

- LiveKit Cloud account (sign up at https://cloud.livekit.io/)
- LiveKit CLI installed
- Python 3.11+ with dependencies installed
- Node.js 18+ for client app

---

## Part 1: LiveKit Cloud Account Setup

### 1. Create LiveKit Cloud Account

1. Go to https://cloud.livekit.io/
2. Sign up with your email or GitHub
3. Verify your email address

### 2. Create a Project

1. Click "Create Project"
2. Name your project (e.g., "voice-llm")
3. Select a region closest to you
4. Click "Create"

### 3. Get API Credentials

1. Go to Project Settings → Keys
2. Click "Generate API Key"
3. Copy and save:
   - **API Key**: `API******`
   - **API Secret**: `*************`
   - **WebSocket URL**: `wss://your-project.livekit.cloud`

**IMPORTANT**: Save these credentials securely. You'll need them for both agent and client.

### 4. Update Environment Variables

Edit `.env` file in project root:

```bash
# LiveKit Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=API******
LIVEKIT_API_SECRET=*************

# Other API keys (for Phase 2+)
DEEPGRAM_API_KEY=your-deepgram-key
GROQ_API_KEY=your-groq-key
CARTESIA_API_KEY=your-cartesia-key
```

---

## Part 2: Install LiveKit CLI

### macOS (Homebrew)

```bash
brew install livekit-cli
```

### Linux

```bash
# Download latest release
curl -sSL https://get.livekit.io/cli | bash

# Or manually download from GitHub
# https://github.com/livekit/livekit-cli/releases
```

### Windows

```bash
# Using Scoop
scoop install livekit-cli

# Or download from GitHub releases
```

### Verify Installation

```bash
lk version
# Should show: livekit-cli version x.x.x
```

---

## Part 3: Authenticate LiveKit CLI

### Method 1: Cloud Authentication

```bash
lk cloud auth
```

This will:
1. Open a browser window
2. Ask you to log in to LiveKit Cloud
3. Save credentials locally

### Method 2: Manual Authentication

```bash
lk cloud auth \
  --url wss://your-project.livekit.cloud \
  --api-key API****** \
  --api-secret *************
```

### Verify Authentication

```bash
lk cloud projects list
# Should show your project
```

---

## Part 4: Deploy Agent to LiveKit Cloud

### Option A: Deploy with LiveKit CLI (Recommended)

#### 1. Navigate to Agent Directory

```bash
cd agent
```

#### 2. Install Dependencies

```bash
# Using Poetry
poetry install

# Or using pip
pip install -r requirements.txt
```

#### 3. Create Agent Deployment

```bash
lk agent create
```

This will prompt you for:
- **Agent name**: `voice-llm-agent`
- **Entry point**: `src.agent` (or `src/agent.py`)
- **Python version**: `3.11`

#### 4. Deploy Agent

```bash
# Deploy to LiveKit Cloud
lk agent deploy

# Or specify project explicitly
lk agent deploy --project your-project-name
```

#### 5. Check Agent Status

```bash
lk agent list
# Should show your agent with status "running"

lk agent logs voice-llm-agent
# Show agent logs
```

### Option B: Run Agent Locally (Development)

For local development and testing:

```bash
cd agent

# Set environment variables
export LIVEKIT_URL=wss://your-project.livekit.cloud
export LIVEKIT_API_KEY=API******
export LIVEKIT_API_SECRET=*************

# Run agent locally
python -m livekit.agents.cli start src.agent

# Or with Poetry
poetry run python -m livekit.agents.cli start src.agent
```

The agent will:
1. Connect to LiveKit Cloud
2. Wait for participants to join rooms
3. Process audio from participants
4. Echo audio back (Phase 1)

---

## Part 5: Generate Access Tokens for Client

The client needs an access token to connect to LiveKit rooms.

### Temporary: Generate Token with CLI

For development, generate a token manually:

```bash
lk token create \
  --room voice-test \
  --identity user-1 \
  --join
```

Copy the generated token and use it in the client app.

### Production: Implement Token Server

**IMPORTANT**: For production, you MUST implement a backend token server.

#### Example Node.js Token Server

```javascript
// token-server.js
const express = require('express');
const { AccessToken } = require('livekit-server-sdk');

const app = express();

app.post('/token', async (req, res) => {
  const { roomName, participantName } = req.body;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
    }
  );

  at.addGrant({ roomJoin: true, room: roomName });

  res.json({ token: at.toJwt() });
});

app.listen(3000);
```

#### Update Client to Use Token Server

Edit `client/src/services/LiveKitService.ts`:

```typescript
private async getToken(roomName: string, participantName: string): Promise<string> {
  const response = await fetch('https://your-api.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName, participantName }),
  });

  const { token } = await response.json();
  return token;
}
```

---

## Part 6: Run Client App

### 1. Install Client Dependencies

```bash
cd client
npm install
```

### 2. Update Configuration

Edit `client/src/config/constants.ts`:

```typescript
export const LIVEKIT_CONFIG = {
  url: 'wss://your-project.livekit.cloud',
  // Token will be fetched from server
};
```

### 3. Run on iOS

```bash
npm run ios
```

### 4. Run on Android

```bash
npm run android
```

### 5. Test the Connection

1. App launches with "Connecting..." status
2. Once connected, status changes to "Connected"
3. Press and hold the PTT button
4. Speak into microphone
5. Release button
6. You should hear your voice echoed back (Phase 1 echo test)

---

## Part 7: Monitor in LiveKit Dashboard

### View Rooms

1. Go to https://cloud.livekit.io/
2. Select your project
3. Click "Rooms" in sidebar
4. See active rooms and participants

### View Agent

1. Click "Agents" in sidebar
2. See your deployed agent status
3. Click on agent to see logs

### View Metrics

1. Click "Analytics" in sidebar
2. See connection metrics
3. Monitor bandwidth usage

---

## Troubleshooting

### Agent Won't Start

**Problem**: Agent fails to start with authentication error

**Solution**:
```bash
# Check environment variables
echo $LIVEKIT_URL
echo $LIVEKIT_API_KEY
echo $LIVEKIT_API_SECRET

# Re-authenticate
lk cloud auth

# Try deploying again
lk agent deploy
```

### Client Can't Connect

**Problem**: Client shows "Connection Error"

**Solution**:
1. Check LiveKit URL in constants.ts
2. Generate a fresh token: `lk token create --room voice-test --identity user-1`
3. Update token in LiveKitService.ts temporarily
4. Check if agent is running: `lk agent list`

### No Audio Echo

**Problem**: Button works but no echo heard

**Solution**:
1. Check agent logs: `lk agent logs voice-llm-agent`
2. Verify microphone permissions in phone settings
3. Check audio is routing correctly (not muted)
4. Try with headphones to rule out echo cancellation interference

### Agent Crashes

**Problem**: Agent shows "stopped" status

**Solution**:
```bash
# View agent logs
lk agent logs voice-llm-agent

# Redeploy agent
lk agent deploy

# Check for Python errors
cd agent
python src/agent.py  # Run locally to see errors
```

---

## Cost Considerations

LiveKit Cloud Free Tier:
- 50 GB egress per month
- ~3,000 minutes of audio
- Suitable for MVP testing

For production, monitor usage in dashboard and upgrade plan as needed.

---

## Next Steps

After successful Phase 1 deployment:

1. **Verify Echo Test Works**
   - Client can record audio
   - Agent receives and echoes it back
   - Latency is acceptable (<1s)

2. **Move to Phase 2: STT Integration**
   - Add Deepgram API integration
   - Implement transcription
   - Test accuracy

3. **Implement Token Server**
   - Build backend endpoint
   - Secure API key storage
   - Update client to fetch tokens

4. **Monitor Performance**
   - Track latency in dashboard
   - Monitor connection quality
   - Optimize as needed

---

## Useful Commands Reference

```bash
# Authentication
lk cloud auth
lk cloud auth --url <url> --api-key <key> --api-secret <secret>

# Projects
lk cloud projects list

# Agents
lk agent create
lk agent deploy
lk agent list
lk agent logs <agent-name>
lk agent delete <agent-name>

# Rooms
lk room list
lk room create <room-name>
lk room delete <room-name>

# Tokens
lk token create --room <room> --identity <name>
lk token create --room <room> --identity <name> --valid-for 24h

# Local development
python -m livekit.agents.cli start src.agent
python -m livekit.agents.cli start src.agent --room <room>
```

---

## Support Resources

- **LiveKit Documentation**: https://docs.livekit.io/
- **LiveKit Cloud Support**: https://livekit.io/support
- **LiveKit Discord**: https://livekit.io/discord
- **GitHub Issues**: https://github.com/livekit/livekit-cli/issues

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Implement token server** for production (don't expose keys in client)
4. **Rotate keys** regularly (every 90 days)
5. **Use separate keys** for dev/staging/production
6. **Monitor usage** to detect unusual activity
7. **Set up alerts** for high usage or errors

---

## Production Checklist

Before going to production:

- [ ] Token server implemented and secured
- [ ] API keys rotated and stored securely
- [ ] Environment variables set for production
- [ ] Agent deployed to LiveKit Cloud (not running locally)
- [ ] Monitoring and alerting configured
- [ ] Error tracking setup (Sentry)
- [ ] Usage limits and rate limiting implemented
- [ ] Backup plan for agent failures
- [ ] Documentation updated with production URLs
- [ ] Client configured with production endpoints

---

For questions or issues, refer to:
- Project docs: `/docs/`
- Testing guide: `/docs/testing-guide.md`
- Deployment guide: `/docs/deployment.md`
