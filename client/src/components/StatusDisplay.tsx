import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ConnectionState, BluetoothState, NetworkType } from '../types';

interface StatusDisplayProps {
  connectionState: ConnectionState;
  bluetoothState: BluetoothState;
  networkType: NetworkType;
}

export default function StatusDisplay({
  connectionState,
  bluetoothState,
  networkType,
}: StatusDisplayProps) {
  const getConnectionColor = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return '#4CAF50';
      case ConnectionState.CONNECTING:
      case ConnectionState.RECONNECTING:
        return '#FFA500';
      case ConnectionState.DISCONNECTED:
        return '#FF4444';
      default:
        return '#888';
    }
  };

  const getConnectionText = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return 'Connected';
      case ConnectionState.CONNECTING:
        return 'Connecting...';
      case ConnectionState.RECONNECTING:
        return 'Reconnecting...';
      case ConnectionState.DISCONNECTED:
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={styles.statusRow}>
        <View style={[styles.indicator, { backgroundColor: getConnectionColor() }]} />
        <Text style={styles.statusText}>{getConnectionText()}</Text>
      </View>

      {/* Bluetooth Status */}
      {bluetoothState === BluetoothState.CONNECTED && (
        <View style={styles.statusRow}>
          <View style={[styles.indicator, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.statusText}>Bluetooth</Text>
        </View>
      )}

      {/* Network Type */}
      <View style={styles.statusRow}>
        <Text style={styles.networkText}>
          {networkType === NetworkType.WIFI ? 'WiFi' :
           networkType === NetworkType.CELLULAR ? 'Cellular' :
           networkType === NetworkType.NONE ? 'No Network' : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  networkText: {
    color: '#AAA',
    fontSize: 14,
  },
});
