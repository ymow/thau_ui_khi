/**
 * TypeScript type definitions for the application
 */

// Agent States
export enum AgentState {
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  ERROR = 'error',
}

// Connection States
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
}

// Bluetooth States
export enum BluetoothState {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  UNKNOWN = 'unknown',
}

// Network Types
export enum NetworkType {
  WIFI = 'wifi',
  CELLULAR = 'cellular',
  NONE = 'none',
  UNKNOWN = 'unknown',
}

// Error Types
export enum ErrorType {
  MICROPHONE_PERMISSION = 'microphone_permission',
  CONNECTION_FAILED = 'connection_failed',
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  API_ERROR = 'api_error',
  UNKNOWN = 'unknown',
}

// Application State
export interface AppState {
  agentState: AgentState;
  connectionState: ConnectionState;
  bluetoothState: BluetoothState;
  networkType: NetworkType;
  error: AppError | null;
}

// Error Object
export interface AppError {
  type: ErrorType;
  message: string;
  timestamp: number;
  retryable: boolean;
}

// Audio Metrics
export interface AudioMetrics {
  duration: number; // milliseconds
  sampleRate: number;
  channelCount: number;
}

// Latency Metrics
export interface LatencyMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  stage: 'stt' | 'llm' | 'tts' | 'total';
}
