import React, { useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { user, logout } = useContext(AuthContext);

  const handleLogin = async () => {
    if (username && password) {
      setLoading(true);
      try {
        const response = await axios.post('https://israeltransport.onrender.com/api/users/Login', {
          username,
          password
        });

        if (response.status === 200) {
          const userData = response.data.user;
          if (userData.userID) {
            await login(userData);
            alert('Login successful');
            if (userData.userType === 'client') {
              navigation.replace('AppTabs', { screen: 'Home' })
            } else if (userData.userType === 'admin') {
              navigation.replace('AdminScreen');
            } else {
              alert('Unknown user type');
            }
          } else {
            throw new Error('User data does not contain userID');
          }
        } else {
          alert('Login failed: Invalid credentials');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Login failed: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter username and password');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('WelcomeScreen');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : 'Log In'}
        </Button>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
  },
  logoutButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
