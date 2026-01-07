# Development Environment Setup Guide

This guide will help you set up your development environment for the Voice-Enabled LLM project.

## Prerequisites

### Required Software

1. **Node.js and npm**
   - Version: Node.js 18+
   - Download: https://nodejs.org/
   - Verify: `node --version && npm --version`

2. **Python**
   - Version: Python 3.11+
   - Download: https://www.python.org/downloads/
   - Verify: `python --version` or `python3 --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

### Platform-Specific Requirements

#### For iOS Development (macOS only)

1. **Xcode**
   - Version: Xcode 15+
   - Install from Mac App Store
   - After installation, run: `sudo xcode-select --switch /Applications/Xcode.app`
   - Accept license: `sudo xcodebuild -license accept`

2. **CocoaPods**
   - Install: `sudo gem install cocoapods`
   - Verify: `pod --version`

3. **iOS Simulator**
   - Included with Xcode
   - Open Xcode → Preferences → Components to download simulators

#### For Android Development

1. **Android Studio**
   - Download: https://developer.android.com/studio
   - Install Android SDK (API level 26+)
   - Install Android Virtual Device (AVD)

2. **Environment Variables**
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   # or
   export ANDROID_HOME=$HOME/Android/Sdk  # Linux

   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Verify Android Setup**
   ```bash
   adb --version
   emulator -list-avds
   ```

---

## API Accounts Setup

### 1. LiveKit Cloud

1. Sign up: https://cloud.livekit.io/
2. Create a new project
3. Go to Settings → Keys
4. Generate API Key and Secret
5. Note the WebSocket URL (format: `wss://your-project.livekit.cloud`)

**Free Tier:** 50 GB egress/month

### 2. Deepgram

1. Sign up: https://console.deepgram.com/signup
2. Go to API Keys
3. Create a new API key
4. Choose "Pay-as-you-go" plan

**Pricing:** ~$0.0043/minute

### 3. Groq

1. Sign up: https://console.groq.com/
2. Go to API Keys
3. Generate API key

**Free Tier:** 14,400 requests/day

### 4. Cartesia

1. Sign up: https://cartesia.ai/
2. Access dashboard
3. Generate API key

**Pricing:** Check current pricing at https://cartesia.ai/pricing

---

## Project Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd thau_ui_khi
```

### 2. Configure Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit .env with your API keys
nano .env  # or use your preferred editor
```

**Required variables:**
```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
DEEPGRAM_API_KEY=your-deepgram-api-key
GROQ_API_KEY=your-groq-api-key
CARTESIA_API_KEY=your-cartesia-api-key
```

### 3. Setup Python Agent

```bash
cd agent

# Install Poetry (recommended)
pip install poetry

# Install dependencies
poetry install

# Or use pip
pip install -r requirements.txt

# Verify installation
poetry run python src/agent.py
# Should see: "Starting Voice LLM Agent..."
```

### 4. Setup React Native Client

```bash
cd client

# Install dependencies
npm install

# iOS only: Install pods
cd ios
pod install
cd ..

# Start development server
npm start
```

---

## Running the Application

### Option 1: Development Mode (Expo)

#### Start Client
```bash
cd client
npm start

# Then choose:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app (physical device)
```

#### Start Agent
```bash
cd agent
poetry run python src/agent.py
```

### Option 2: iOS Simulator

```bash
cd client
npm run ios
```

### Option 3: Android Emulator

```bash
# Start emulator first
emulator -avd <your_avd_name>

# Then run app
cd client
npm run android
```

### Option 4: Physical Device

#### iOS (via Expo Go)
1. Install Expo Go from App Store
2. Run `npm start` in client directory
3. Scan QR code with Camera app
4. Opens in Expo Go automatically

#### Android (via Expo Go)
1. Install Expo Go from Play Store
2. Run `npm start` in client directory
3. Scan QR code with Expo Go app

---

## Verification Checklist

### Python Agent
- [ ] Agent starts without errors
- [ ] Logs show "Agent initialized. Waiting for connections..."
- [ ] No missing API key errors

### React Native Client
- [ ] App launches on simulator/emulator
- [ ] Black screen displayed (placeholder)
- [ ] No red error screen
- [ ] Console shows no critical errors

### API Connectivity
- [ ] LiveKit WebSocket URL is reachable
- [ ] Deepgram API key is valid (test with curl)
- [ ] Groq API key is valid
- [ ] Cartesia API key is valid

### Test API Keys

```bash
# Test Deepgram
curl -X POST https://api.deepgram.com/v1/listen \
  -H "Authorization: Token YOUR_DEEPGRAM_KEY" \
  -H "Content-Type: audio/wav" \
  --data-binary @test.wav

# Test Groq
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3-70b-8192","messages":[{"role":"user","content":"test"}]}'
```

---

## Troubleshooting

### Common Issues

#### "Module not found" errors (React Native)
```bash
cd client
rm -rf node_modules
npm install
npm start --reset-cache
```

#### "Pod install failed" (iOS)
```bash
cd client/ios
pod deintegrate
pod install
```

#### Python import errors
```bash
cd agent
poetry install --no-cache
# or
pip install -r requirements.txt --force-reinstall
```

#### Port already in use
```bash
# Kill process on port 8081 (Metro bundler)
lsof -ti:8081 | xargs kill -9

# Kill process on port 8080 (Agent)
lsof -ti:8080 | xargs kill -9
```

#### Android emulator won't start
```bash
# List available AVDs
emulator -list-avds

# Start specific AVD
emulator -avd Pixel_5_API_33 &

# Check if emulator is running
adb devices
```

### Getting Help

- Check `docs/testing-guide.md` for testing procedures
- Check `docs/deployment.md` for production deployment
- Review error logs in:
  - Client: Metro bundler terminal
  - Agent: Agent terminal output
  - LiveKit: LiveKit dashboard

---

## Next Steps

After successful setup:

1. Review [MVP Requirements](../openspec/specs/mvp-requirements.md)
2. Check [Implementation Tasks](../openspec/changes/001-mvp-foundation/tasks.md)
3. Start with Phase 1: Audio Pipeline Foundation
4. Test on physical device with Bluetooth audio

---

## Development Tools (Optional but Recommended)

### VS Code Extensions
- ESLint
- Prettier
- Python
- React Native Tools
- TypeScript Vue Plugin (Volar)

### Browser Developer Tools
- React DevTools
- Redux DevTools (if using Redux)

### Monitoring Tools
- LiveKit Dashboard: Monitor room connections
- Expo DevTools: Debug React Native app
- Chrome DevTools: For web debugging

---

## Contact

For setup issues, please check:
1. This guide first
2. GitHub Issues
3. Project maintainers
