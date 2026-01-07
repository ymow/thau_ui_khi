import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// TODO: Import VoiceScreen after Phase 1 implementation
// import VoiceScreen from './src/screens/VoiceScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* TODO: Replace with VoiceScreen */}
      <View style={styles.placeholder}>
        {/* Placeholder for VoiceScreen - to be implemented in Phase 1 */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#000',
  },
});
