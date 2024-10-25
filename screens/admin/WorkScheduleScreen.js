import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, Modal } from 'react-native-paper';
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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
        alert('Sign up successful. A verification code has been sent to your email.');
        setModalVisible(true); // Show modal to verify code
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

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://israeltransport.onrender.com/api/users/verify-code', {
        email,
        verificationCode,
      });

      if (response.status === 200) {
        alert('Verification successful. Welcome!');
        setModalVisible(false);
        navigation.navigate('LoginScreen');
      } else {
        alert('Verification failed. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Verification failed: ' + (error.response?.data?.message || error.message));
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

        {/* Modal for Verification Code */}
        <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <View>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <TextInput
              label="Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              style={styles.input}
              mode="outlined"
              keyboardType="number-pad"
            />
            <Button mode="contained" onPress={handleVerifyCode} style={styles.button}>
              {loading ? <ActivityIndicator color="#fff" /> : 'Verify Code'}
            </Button>
          </View>
        </Modal>
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default SignUpScreen;
