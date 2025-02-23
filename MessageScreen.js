import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Hello! This is a simple message.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: 18,
    color: '#333',
  },
});

export default MessageScreen;
