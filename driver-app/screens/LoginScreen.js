import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post('http://192.168.159.134:3000/login', { busNumber, password });
      const { token, route } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigation.navigate('Home', { busNumber, driverRoute: route });
    } catch (error) {
      if (error.response) {
        Alert.alert('Login failed', error.response.data);
      } else if (error.request) {
        Alert.alert('Login failed', 'No response from server');
      } else {
        Alert.alert('Login failed', error.message);
      }
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
      <Button title="Login" onPress={login} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
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

export default LoginScreen;