import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSessionDebug } from '@/hooks/useSessionDebug';
import Colors from '@/constants/Colors';

export function SessionDebugButton() {
  const { logSessionData } = useSessionDebug();

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={logSessionData}
    >
      <Text style={styles.buttonText}>Debug Session</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});