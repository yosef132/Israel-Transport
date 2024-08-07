import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Image source={require('../assets/welcome.jpg')} style={styles.image} />
        <Text style={styles.title}>Israel Transport</Text>
        <Text style={styles.subtitle}>Know where is your next trip and make yourself better 😊</Text>
        <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')} style={styles.button}>
          Log In
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('SignUpScreen')} style={styles.buttonOutline}>
          Sign Up
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('AppTabs', { screen: 'Home' })} style={styles.buttonOutline1}>
          See some trips in Israel
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '80%',
    paddingVertical: 5,
    backgroundColor: '#007AFF',
  },
  buttonOutline: {
    marginTop: 10,
    width: '80%',
    paddingVertical: 5,
    borderColor: '#007AFF',
  },
  buttonOutline1: {
    marginTop: 10,
    width: '80%',
    paddingVertical: 5,
    borderColor: 'black',
  },
});
