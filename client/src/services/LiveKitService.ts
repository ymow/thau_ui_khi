/**
 * LiveKit service for managing room connections and audio tracks
 */
import {
  Room,
  RoomEvent,
  Track,
  LocalAudioTrack,
  RemoteAudioTrack,
  AudioCaptureOptions,
  RoomOptions,
  VideoPresets,
} from 'livekit-client';

import { LIVEKIT_CONFIG, AUDIO_CONFIG } from '../config/constants';

export class LiveKitService {
  private room: Room | null = null;
  private audioTrack: LocalAudioTrack | null = null;
  private isRecording = false;

  constructor() {
    console.log('LiveKitService initialized');
  }

  /**
   * Connect to a LiveKit room
   */
  async connect(roomName: string, participantName: string): Promise<void> {
    try {
      console.log(`Connecting to room: ${roomName} as ${participantName}`);

      // Create room instance
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      } as RoomOptions);

      // Set up event listeners
      this.setupEventListeners();

      // TODO: In production, get token from your backend server
      // For now, you'll need to generate a token using LiveKit CLI:
      // lk token create --room <room-name> --identity <participant-name>
      const token = await this.getToken(roomName, participantName);

      // Connect to the room
      await this.room.connect(LIVEKIT_CONFIG.url, token);

      console.log('Connected to LiveKit room successfully');
    } catch (error) {
      console.error('Failed to connect to LiveKit room:', error);
      throw error;
    }
  }

  /**
   * Get LiveKit access token
   * TODO: Implement a backend endpoint to generate tokens securely
   */
  private async getToken(roomName: string, participantName: string): Promise<string> {
    // TEMPORARY: For development, you can generate a token using LiveKit CLI:
    // lk token create --room voice-test --identity user-1
    // In production, this should be an API call to your backend

    // For now, throw an error with instructions
    throw new Error(
      'Token generation not implemented. Please generate a token using:\n' +
      `lk token create --room ${roomName} --identity ${participantName}\n` +
      'Then pass it to the connect method.'
    );

    // In production, you would do something like:
    // const response = await fetch('https://your-api.com/livekit-token', {
    //   method: 'POST',
    //   body: JSON.stringify({ roomName, participantName }),
    // });
    // const { token } = await response.json();
    // return token;
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    if (!this.room) {
      throw new Error('Not connected to room');
    }

    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    try {
      console.log('Starting audio recording...');

      // Create local audio track
      this.audioTrack = await this.room.localParticipant.createTrack({
        audio: {
          sampleRate: AUDIO_CONFIG.sampleRate,
          channelCount: AUDIO_CONFIG.channelCount,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      } as AudioCaptureOptions);

      // Publish the track
      await this.room.localParticipant.publishTrack(this.audioTrack);

      this.isRecording = true;
      console.log('Audio recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording audio
   */
  async stopRecording(): Promise<void> {
    if (!this.isRecording || !this.audioTrack) {
      return;
    }

    try {
      console.log('Stopping audio recording...');

      // Unpublish the track
      if (this.room) {
        await this.room.localParticipant.unpublishTrack(this.audioTrack);
      }

      // Stop the track
      this.audioTrack.stop();
      this.audioTrack = null;
      this.isRecording = false;

      console.log('Audio recording stopped');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the room
   */
  async disconnect(): Promise<void> {
    if (!this.room) {
      return;
    }

    try {
      console.log('Disconnecting from room...');

      // Stop recording if active
      if (this.isRecording) {
        await this.stopRecording();
      }

      // Disconnect from room
      await this.room.disconnect();
      this.room = null;

      console.log('Disconnected from LiveKit room');
    } catch (error) {
      console.error('Error disconnecting from room:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners for the room
   */
  private setupEventListeners(): void {
    if (!this.room) return;

    this.room.on(RoomEvent.Connected, () => {
      console.log('Room connected');
    });

    this.room.on(RoomEvent.Disconnected, () => {
      console.log('Room disconnected');
    });

    this.room.on(RoomEvent.Reconnecting, () => {
      console.log('Room reconnecting...');
    });

    this.room.on(RoomEvent.Reconnected, () => {
      console.log('Room reconnected');
    });

    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      console.log('Track subscribed:', track.sid);

      if (track.kind === Track.Kind.Audio) {
        const audioTrack = track as RemoteAudioTrack;
        // Attach to audio element for playback
        const audioElement = audioTrack.attach();
        document.body.appendChild(audioElement);
      }
    });

    this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      console.log('Track unsubscribed:', track.sid);
    });

    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log('Participant connected:', participant.identity);
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log('Participant disconnected:', participant.identity);
    });
  }

  /**
   * Get current connection state
   */
  getConnectionState(): string {
    return this.room?.state || 'disconnected';
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

// Export singleton instance
export const liveKitService = new LiveKitService();
