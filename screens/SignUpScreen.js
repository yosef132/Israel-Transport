import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword || !language || !country || !city) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://israeltransport.onrender.com/api/users/SignUp', {
        fullName,
        username,
        email,
        password,
        language,
        country,
        city,
        userTypeID: 2,
        userType: 'Client', 
      });

      if (response.status === 201) {
        alert('Sign up successful');
        navigation.navigate('LoginScreen');
      } else {
        alert('Sign up failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Sign up failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
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
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Language"
          value={language}
          onChangeText={setLanguage}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Country"
          value={country}
          onChangeText={setCountry}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="City"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
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
});

export default SignUpScreen;
