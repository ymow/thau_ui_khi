# Deployment Guide

Guide for deploying the Voice-Enabled LLM application to production.

## Overview

The application consists of two components:
1. **Python Agent**: Server-side agent (requires hosting)
2. **React Native Client**: Mobile app (distributed via App Store/Play Store)

---

## Python Agent Deployment

The Python agent needs to run 24/7 in a cloud environment.

### Recommended Platforms

| Platform | Pros | Cons | Cost |
|----------|------|------|------|
| **Render** | Easy deploy, auto-scaling | Limited free tier | ~$7/month (Starter) |
| **Railway** | Simple setup, good DX | Pricing based on usage | ~$5-20/month |
| **Fly.io** | Global edge deployment | Learning curve | Free tier available |
| **AWS ECS** | Powerful, scalable | Complex setup | Variable |
| **Google Cloud Run** | Pay-per-use | Cold starts | Pay-per-use |

**Recommendation for MVP**: Railway or Render (easiest setup)

---

## Option 1: Deploy to Railway

### Prerequisites
- Railway account: https://railway.app/
- GitHub repository

### Steps

1. **Create Dockerfile** (already in `/agent/Dockerfile` if created)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY src/ ./src/

# Run agent
CMD ["python", "src/agent.py"]
```

2. **Push to GitHub**

```bash
git add .
git commit -m "Add Dockerfile for agent"
git push origin main
```

3. **Deploy on Railway**

- Go to Railway dashboard
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select your repository
- Railway auto-detects Dockerfile
- Add environment variables in Railway dashboard:
  ```
  LIVEKIT_URL=wss://your-project.livekit.cloud
  LIVEKIT_API_KEY=your-key
  LIVEKIT_API_SECRET=your-secret
  DEEPGRAM_API_KEY=your-key
  GROQ_API_KEY=your-key
  CARTESIA_API_KEY=your-key
  PYTHON_ENV=production
  ```
- Click "Deploy"

4. **Verify Deployment**

- Check Railway logs for "Agent initialized"
- Test connection from client app
- Monitor LiveKit dashboard for agent presence

---

## Option 2: Deploy to Render

### Steps

1. **Create `render.yaml`**

```yaml
services:
  - type: web
    name: voice-llm-agent
    env: python
    region: oregon
    plan: starter
    buildCommand: pip install -r requirements.txt
    startCommand: python src/agent.py
    envVars:
      - key: LIVEKIT_URL
        sync: false
      - key: LIVEKIT_API_KEY
        sync: false
      - key: LIVEKIT_API_SECRET
        sync: false
      - key: DEEPGRAM_API_KEY
        sync: false
      - key: GROQ_API_KEY
        sync: false
      - key: CARTESIA_API_KEY
        sync: false
      - key: PYTHON_ENV
        value: production
```

2. **Deploy on Render**

- Go to Render dashboard: https://dashboard.render.com/
- Click "New +" → "Blueprint"
- Connect GitHub repository
- Render detects `render.yaml`
- Add environment variables in dashboard
- Click "Apply"

3. **Monitor Deployment**

- Check Render logs
- Verify agent connection in LiveKit

---

## Option 3: Docker Compose (Self-Hosted)

For self-hosting on your own server.

### Create `docker-compose.yml`

```yaml
version: '3.8'

services:
  agent:
    build:
      context: ./agent
      dockerfile: Dockerfile
    environment:
      - LIVEKIT_URL=${LIVEKIT_URL}
      - LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
      - LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
      - DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - CARTESIA_API_KEY=${CARTESIA_API_KEY}
      - PYTHON_ENV=production
    ports:
      - "8080:8080"
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Deploy

```bash
# On your server
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## React Native Client Deployment

### iOS Deployment (TestFlight)

#### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- App Store Connect access

#### Steps

1. **Configure App**

```bash
cd client
# Update app.json with your bundle identifier
```

2. **Build for iOS**

```bash
# Using Expo EAS Build (easiest)
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile preview
```

3. **Submit to TestFlight**

```bash
eas submit --platform ios
```

4. **Invite Testers**

- Go to App Store Connect
- Navigate to TestFlight
- Add internal/external testers
- Share TestFlight link

#### Alternative: Manual Xcode Build

```bash
# Eject from Expo (if needed)
expo prebuild

# Open in Xcode
cd ios
open VoiceLLM.xcworkspace

# In Xcode:
# - Select target device (Any iOS Device)
# - Product → Archive
# - Distribute App → TestFlight
```

---

### Android Deployment (Internal Testing)

#### Prerequisites
- Google Play Console account ($25 one-time)
- Android Studio installed

#### Steps

1. **Configure App**

```bash
cd client
# Update app.json with your package name
```

2. **Generate Signing Key**

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore voice-llm.keystore \
  -alias voice-llm \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

3. **Build AAB**

```bash
# Using Expo EAS Build
eas build --platform android --profile preview

# Or manually
cd android
./gradlew bundleRelease
```

4. **Upload to Play Console**

- Go to Google Play Console
- Create new app
- Upload AAB to Internal Testing track
- Add testers (by email)
- Publish release

---

## Environment Configuration

### Production Environment Variables

**Agent (`agent/.env.production`)**

```bash
# LiveKit
LIVEKIT_URL=wss://your-production.livekit.cloud
LIVEKIT_API_KEY=prod-api-key
LIVEKIT_API_SECRET=prod-api-secret

# APIs
DEEPGRAM_API_KEY=prod-deepgram-key
GROQ_API_KEY=prod-groq-key
CARTESIA_API_KEY=prod-cartesia-key

# Environment
PYTHON_ENV=production
LOG_LEVEL=warning

# Monitoring
SENTRY_DSN=https://your-sentry-dsn (optional)
```

**Client (`client/src/config/constants.ts`)**

```typescript
export const LIVEKIT_CONFIG = {
  // Production: Use token server endpoint
  tokenEndpoint: 'https://your-api.com/livekit-token',
  // Development: Direct URL (for testing only)
  url: process.env.EXPO_PUBLIC_LIVEKIT_URL,
};
```

### Security Best Practices

1. **Never commit API keys** to repository
2. **Use environment variables** for all secrets
3. **Rotate keys regularly** (every 90 days)
4. **Use separate keys** for dev/staging/production
5. **Implement token server** for LiveKit (don't expose keys in client)

---

## Monitoring & Logging

### Application Monitoring

#### Option 1: Sentry (Recommended)

**Setup:**

```bash
# Agent
pip install sentry-sdk
```

```python
# In agent/src/agent.py
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment="production",
)
```

```bash
# Client
npm install @sentry/react-native
```

```typescript
// In client/App.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: "production",
});
```

#### Option 2: Custom Logging

**Agent:**
- Use Python `logging` module
- Send logs to CloudWatch/Datadog
- Store in file with log rotation

**Client:**
- Use console.log with levels
- Send to backend API
- Use React Native Debugger

### LiveKit Dashboard Monitoring

Monitor in real-time:
- Active rooms
- Participant count
- Bandwidth usage
- Error rates

Access: https://cloud.livekit.io/projects/[your-project]/dashboard

---

## Performance Optimization

### Agent Optimization

1. **Use connection pooling** for API clients
2. **Cache LLM responses** for common queries (optional)
3. **Implement rate limiting** per user
4. **Use async/await** properly
5. **Monitor memory usage**

### Client Optimization

1. **Optimize audio buffer sizes**
2. **Minimize re-renders**
3. **Use React.memo** for components
4. **Lazy load resources**
5. **Enable Hermes** (Android)

---

## Scaling Considerations

### Current MVP Limits

- **LiveKit Free Tier**: 50 GB egress/month (~3000 minutes)
- **Groq Free Tier**: 14,400 requests/day
- **Deepgram**: Pay-as-you-go (~$100/month for 1000 daily users)

### Scaling Triggers

**When to scale:**
- Agent CPU > 70%
- Response latency > 3s (P95)
- Daily users > 100
- API costs > budget

**How to scale:**

1. **Horizontal scaling**: Deploy multiple agent instances
2. **Load balancing**: Use Kubernetes or cloud load balancer
3. **Caching**: Add Redis for frequent queries
4. **CDN**: Serve static assets via CDN
5. **Database**: Add PostgreSQL for user data (post-MVP)

---

## Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Agent

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: voice-llm-agent
```

---

## Rollback Procedure

If deployment fails:

### Railway/Render
- Go to dashboard
- Select previous deployment
- Click "Redeploy"

### Docker Compose
```bash
docker-compose down
git checkout previous-commit
docker-compose up -d --build
```

### iOS/Android
- Previous version remains available in stores
- Users won't auto-update to broken version

---

## Cost Estimation

### Monthly Costs (MVP with 100 daily active users)

| Service | Usage | Cost |
|---------|-------|------|
| LiveKit Cloud | ~30,000 minutes | Free tier |
| Deepgram STT | ~30,000 minutes | ~$130 |
| Groq LLM | Free tier | $0 |
| Cartesia TTS | ~50,000 words | ~$75 |
| Agent Hosting | Railway Starter | $7 |
| **Total** | | **~$212/month** |

### Cost Optimization

1. **Cache common responses**
2. **Limit response length** (fewer TTS tokens)
3. **Implement usage limits** per user
4. **Use free tier APIs** where possible
5. **Monitor usage** daily

---

## Health Checks

### Agent Health Check

```python
# Add to agent/src/agent.py
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": time.time()}
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Configure alerts for downtime.

---

## Backup & Disaster Recovery

### What to backup:
- Environment variables (in secure location)
- API keys (in password manager)
- Git repository (on GitHub)
- User data (if added post-MVP)

### Recovery procedure:
1. Restore from GitHub
2. Redeploy to cloud platform
3. Restore environment variables
4. Verify connectivity
5. Test with client app

---

## Support & Maintenance

### Post-Deployment Checklist

- [ ] Agent is running and reachable
- [ ] Client app connects successfully
- [ ] All API keys are valid
- [ ] Monitoring is active
- [ ] Logs are accessible
- [ ] Backup procedures documented
- [ ] On-call rotation defined
- [ ] Incident response plan created

### Regular Maintenance

**Weekly:**
- Check error rates
- Review logs for issues
- Monitor API usage/costs

**Monthly:**
- Update dependencies
- Review security advisories
- Analyze performance metrics
- Optimize costs

**Quarterly:**
- Rotate API keys
- Review architecture
- Plan scaling needs
- Update documentation

---

## Contact & Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Contact platform support (Railway/Render/etc)
4. Check project GitHub Issues

---

## Next Steps

After successful deployment:
1. Invite alpha testers
2. Monitor performance metrics
3. Gather user feedback
4. Plan Phase 2 features
5. Optimize based on real usage data
