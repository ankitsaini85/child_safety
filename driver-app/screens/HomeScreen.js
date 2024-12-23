import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import StudentsList from './StudentsList';

const HomeScreen = ({ route, navigation }) => {
  const { busNumber, driverRoute } = route.params;
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Allow location access to start tracking.');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error('Error requesting location permission:', error);
        Alert.alert('Error', 'An error occurred while requesting location permission.');
      }
    };

    requestLocationPermission();
  }, []);

  const startTracking = async () => {
    if (!location) {
      Alert.alert('Location Not Available', 'Please enable location services.');
      return;
    }

    setTracking(true);

    const id = setInterval(async () => {
      try {
        await axios.post('http://192.168.144.134:3000/track', {
          busNumber,
          latitude: location.latitude,
          longitude: location.longitude,
        });
        console.log('Location sent to server');
      } catch (error) {
        console.error('Error sending location:', error);
      }
    }, 4000);

    setIntervalId(id);
  };

  const stopTracking = () => {
    clearInterval(intervalId);
    setTracking(false);
    setIntervalId(null);
  };

  const handleTracking = () => {
    if (tracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome, Driver</Text>
        <Text style={styles.subtitle}>Bus Number: {busNumber}</Text>
        <Text style={styles.subtitle}>Route: {driverRoute}</Text>
        <TouchableOpacity
          style={[styles.button, tracking && styles.trackingButton]}
          onPress={handleTracking}
        >
          <Text style={[styles.buttonText, tracking && styles.trackingButtonText]}>
            {tracking ? 'Stop Tracking' : 'Start Tracking'}
          </Text>
        </TouchableOpacity>
      </View>
      <StudentsList busNumber={busNumber} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  trackingButton: {
    backgroundColor: '#ff0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackingButtonText: {
    color: '#fff',
  },
});

export default HomeScreen;