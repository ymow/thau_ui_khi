/**
 * Application constants and configuration
 */

// LiveKit Configuration
// TODO: Replace with your LiveKit credentials
export const LIVEKIT_CONFIG = {
  url: process.env.LIVEKIT_URL || 'wss://your-project.livekit.cloud',
  // Note: API keys should NOT be in client code in production
  // This is for development only. Use a token server in production.
};

// Audio Configuration
export const AUDIO_CONFIG = {
  sampleRate: 16000, // Hz
  channelCount: 1, // Mono
  bitDepth: 16,
  maxRecordingDuration: 30000, // 30 seconds in milliseconds
  minRecordingDuration: 1000, // 1 second
};

// UI Configuration
export const UI_CONFIG = {
  buttonSize: 120, // PTT button size in pixels
  hapticEnabled: true,
  darkMode: true,
};

// Network Configuration
export const NETWORK_CONFIG = {
  reconnectAttempts: 5,
  reconnectBackoff: [2000, 4000, 8000, 16000, 32000], // Exponential backoff in ms
  connectionTimeout: 15000, // 15 seconds
};

// Latency Targets (for monitoring)
export const LATENCY_TARGETS = {
  p50: 1500, // 1.5 seconds
  p95: 2000, // 2 seconds
  timeout: 15000, // 15 seconds
};

// Error Messages
export const ERROR_MESSAGES = {
  microphonePermission: 'Microphone permission is required for voice input.',
  connectionFailed: 'Failed to connect to voice service.',
  networkError: 'Network error. Please check your connection.',
  timeout: 'Request timed out. Please try again.',
  unknown: 'An unexpected error occurred.',
};
