# Voice LLM Client

React Native mobile app for voice interaction with LLM while driving/riding.

## Setup

```bash
npm install

# iOS
npx pod-install ios
npm run ios

# Android
npm run android
```

## Configuration

The app reads LiveKit credentials from environment variables. In development, you can configure these in `src/config/constants.ts`.

## Project Structure

```
src/
├── screens/
│   └── VoiceScreen.tsx        # Main PTT interface
├── components/
│   ├── PTTButton.tsx          # Push-to-talk button
│   ├── StatusDisplay.tsx      # Connection status
│   └── LoadingIndicator.tsx   # Processing states
├── services/
│   ├── LiveKitService.ts      # LiveKit room management
│   ├── AudioService.ts        # Audio capture/playback
│   └── BluetoothService.ts    # Bluetooth routing
├── hooks/
│   ├── useLiveKit.ts          # LiveKit state management
│   ├── useAudioSession.ts     # Audio session management
│   └── useNetworkStatus.ts    # Network monitoring
├── types/
│   └── index.ts               # TypeScript types
└── config/
    └── constants.ts           # Configuration
```

## Development

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test
```

## Platform-Specific Notes

### iOS
- Requires microphone permission (configured in app.json)
- Background audio requires "audio" background mode (configured)
- Test on physical device for best Bluetooth support

### Android
- Requires RECORD_AUDIO and BLUETOOTH permissions (configured)
- Test on physical device for real-world audio quality

## Testing on Device

1. Install Expo Go app on your device
2. Scan QR code from `npm start`
3. For production testing, build standalone app

## Troubleshooting

### Microphone Permission
- iOS: Check Settings → Privacy → Microphone
- Android: Check App Settings → Permissions

### Bluetooth Issues
- Ensure Bluetooth device is paired in system settings
- Check app has Bluetooth permissions (Android)
- Try disconnecting and reconnecting Bluetooth device

### Audio Quality
- Test with wired headphones first to rule out Bluetooth issues
- Check microphone is not covered or obstructed
- Ensure app has microphone permission
