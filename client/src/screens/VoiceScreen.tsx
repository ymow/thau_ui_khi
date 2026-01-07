import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import PTTButton from '../components/PTTButton';
import StatusDisplay from '../components/StatusDisplay';
import { liveKitService } from '../services/LiveKitService';
import { AgentState, ConnectionState, BluetoothState, NetworkType } from '../types';

export default function VoiceScreen() {
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>(
    BluetoothState.UNKNOWN
  );
  const [networkType, setNetworkType] = useState<NetworkType>(NetworkType.UNKNOWN);

  useEffect(() => {
    // Initialize connection on mount
    initializeConnection();

    // Cleanup on unmount
    return () => {
      liveKitService.disconnect();
    };
  }, []);

  const initializeConnection = async () => {
    try {
      setConnectionState(ConnectionState.CONNECTING);

      // Generate a unique room name and participant name
      const roomName = 'voice-test';
      const participantName = `user-${Date.now()}`;

      await liveKitService.connect(roomName, participantName);

      setConnectionState(ConnectionState.CONNECTED);
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionState(ConnectionState.DISCONNECTED);

      Alert.alert(
        'Connection Error',
        'Failed to connect to voice service. Please check your configuration.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePressIn = async () => {
    try {
      console.log('PTT button pressed - starting recording');
      setAgentState(AgentState.LISTENING);
      await liveKitService.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setAgentState(AgentState.ERROR);

      Alert.alert(
        'Recording Error',
        'Failed to start recording. Please check microphone permissions.',
        [{ text: 'OK', onPress: () => setAgentState(AgentState.IDLE) }]
      );
    }
  };

  const handlePressOut = async () => {
    try {
      console.log('PTT button released - stopping recording');
      await liveKitService.stopRecording();

      // Transition to thinking state
      // In Phase 1 (echo test), we'll immediately go back to IDLE after echo
      // In Phase 2+, we'll stay in THINKING while processing STT -> LLM -> TTS
      setAgentState(AgentState.THINKING);

      // Simulate processing time (remove this in production)
      setTimeout(() => {
        setAgentState(AgentState.IDLE);
      }, 500);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setAgentState(AgentState.ERROR);

      Alert.alert(
        'Error',
        'An error occurred while processing your request.',
        [{ text: 'OK', onPress: () => setAgentState(AgentState.IDLE) }]
      );
    }
  };

  const isDisabled = connectionState !== ConnectionState.CONNECTED;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Voice LLM</Text>
        <StatusDisplay
          connectionState={connectionState}
          bluetoothState={bluetoothState}
          networkType={networkType}
        />
      </View>

      <View style={styles.content}>
        <PTTButton
          state={agentState}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Phase 1: Echo Test</Text>
        {isDisabled && (
          <Text style={styles.warningText}>
            Waiting for connection...
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  warningText: {
    color: '#FFA500',
    fontSize: 14,
    marginTop: 8,
  },
});
