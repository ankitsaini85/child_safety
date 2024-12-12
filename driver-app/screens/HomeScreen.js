import React, { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

const HomeScreen = () => {
  const [isTracking, setIsTracking] = useState(false);

  const handleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Track"
        onPress={handleTracking}
        color={isTracking ? "red" : "blue"}
      />
      <Text style={styles.large}>Tracking Status: {isTracking ? "On" : "Off"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  large: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;