import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const SignUpScreen = ({ navigation }) => {
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');
  const [route, setRoute] = useState(''); // New state for route

  const signUp = async () => {
    try {
      const response = await axios.post('http://192.168.38.134:3000/register', { busNumber, password ,route});
      if (response.status === 200) {
        Alert.alert('Sign Up successful', 'Login Now');
        navigation.navigate('Login');
      } else {
        Alert.alert('Sign Up failed', 'Error registering user');
      }
    } catch (error) {
      Alert.alert('Sign Up failed', error.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Bus Number"
        value={busNumber}
        onChangeText={setBusNumber}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Enter your route"
        value={route}
        onChangeText={setRoute}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={signUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default SignUpScreen;