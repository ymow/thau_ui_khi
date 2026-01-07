import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Vibration,
} from 'react-native';
import { AgentState } from '../types';

interface PTTButtonProps {
  state: AgentState;
  onPressIn: () => void;
  onPressOut: () => void;
  disabled?: boolean;
}

export default function PTTButton({
  state,
  onPressIn,
  onPressOut,
  disabled = false,
}: PTTButtonProps) {
  const handlePressIn = () => {
    if (!disabled) {
      Vibration.vibrate(50); // Short haptic feedback
      onPressIn();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Vibration.vibrate(30); // Shorter haptic feedback
      onPressOut();
    }
  };

  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;

    switch (state) {
      case AgentState.LISTENING:
        return styles.buttonListening;
      case AgentState.THINKING:
        return styles.buttonThinking;
      case AgentState.SPEAKING:
        return styles.buttonSpeaking;
      case AgentState.ERROR:
        return styles.buttonError;
      default:
        return styles.buttonIdle;
    }
  };

  const getButtonText = () => {
    switch (state) {
      case AgentState.LISTENING:
        return 'Listening...';
      case AgentState.THINKING:
        return 'Thinking...';
      case AgentState.SPEAKING:
        return 'Speaking...';
      case AgentState.ERROR:
        return 'Error';
      default:
        return 'Hold to Talk';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle()]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>

      {state === AgentState.IDLE && (
        <Text style={styles.hint}>Press and hold to speak</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonIdle: {
    backgroundColor: '#4A4A4A',
  },
  buttonListening: {
    backgroundColor: '#FF4444',
  },
  buttonThinking: {
    backgroundColor: '#FFA500',
  },
  buttonSpeaking: {
    backgroundColor: '#4CAF50',
  },
  buttonError: {
    backgroundColor: '#CC0000',
  },
  buttonDisabled: {
    backgroundColor: '#2A2A2A',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    marginTop: 20,
    color: '#888',
    fontSize: 14,
  },
});
