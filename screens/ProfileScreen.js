import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import { Text, Image, Button, Switch, Input } from 'react-native-elements';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import { AuthContext } from '../contexts/AuthContext';
import { Icon } from 'react-native-elements';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBugModalVisible, setBugModalVisible] = useState(false);
  const [bugMessage, setBugMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfileData();
    } else {
      navigation.navigate('WelcomeScreen');
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`https://israeltransport.onrender.com/api/users/GetUserByID/${user.userID}`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to fetch profile data');
    } finally {
      setLoading(false);
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleBugModal = () => {
    setBugModalVisible(!isBugModalVisible);
  };

  const handleContactUs = () => {
    Linking.openURL('tel:0504226784');
  };

  const handleReportBug = async () => {
    if (!bugMessage) {
      alert('Please enter a message for the bug report');
      return;
    }

    try {
      const reportData = {
        ReportID: Math.floor(Math.random() * 1000000), // Generate a unique ReportID
        UserID: user.userID,
        Message: bugMessage,
        Timestamp: new Date().toISOString(), // Ensure the timestamp is in the correct format
        Status: 'Pending',
      };

      const response = await axios.post('https://israeltransport.onrender.com/api/reports/create/', reportData);

      if (response.status === 201) {
        alert('Bug report successfully submitted');
        setBugMessage('');
        toggleBugModal();
      } else {
        alert('Failed to submit bug report');
      }
    } catch (error) {
      console.error('Error reporting bug:', error);
      alert('An error occurred while submitting the bug report');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data., Please try again later.</Text>
        <Button title="Go to Welcome Screen" onPress={() => navigation.navigate('WelcomeScreen')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={1500} style={styles.card}>
        <Image source={require('../assets/images/profile.jpg')} style={styles.profileImage} />
        <View style={styles.accountDetails}>
          <Text style={styles.accountName}>{profileData.fullName}</Text>
          <Text style={styles.accountEmail}>
            {profileData.email}
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
          </Text>
          <Text style={styles.accountInfo}>Language: {profileData.language}</Text>
          <Text style={styles.accountInfo}>Country: {profileData.country}</Text>
          <Text style={styles.accountInfo}>City: {profileData.city}</Text>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1500} delay={300} style={styles.preferencesContainer}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Email Notifications</Text>
          <Switch value={emailNotifications} onValueChange={setEmailNotifications} />
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Push Notifications</Text>
          <Switch value={pushNotifications} onValueChange={setPushNotifications} />
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1500} delay={600} style={styles.resourcesContainer}>
        <Text style={styles.sectionTitle}>RESOURCES</Text>
        <TouchableOpacity style={styles.resourceItem} onPress={handleContactUs}>
          <Text style={styles.resourceText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceItem} onPress={toggleBugModal}>
          <Text style={styles.resourceText}>Report Bug</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceItem}>
          <Text style={styles.resourceText}>Rate in App Store</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resourceItem} onPress={toggleModal}>
          <Text style={styles.resourceText}>Terms and Privacy</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1500} delay={900} style={styles.logoutContainer}>
        <Button title="Log Out" onPress={handleLogout} buttonStyle={styles.logoutButton} />
        <Text style={styles.appVersion}> israeltransport App Version 1.00 </Text>
      </Animatable.View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Terms and Privacy</Text>
          <ScrollView>
            <Text style={styles.modalText}>
              Welcome to Israel Transport! Your privacy is important to us. Our terms and privacy policies ensure that your data is safe and secure. We collect minimal personal information and use it solely for improving your experience with our app. Please read through our detailed terms and privacy policies to understand how we handle your information.
            </Text>
          </ScrollView>
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>

      <Modal isVisible={isBugModalVisible} onBackdropPress={toggleBugModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Report a Bug</Text>
          <Input
            placeholder="Describe the issue"
            value={bugMessage}
            onChangeText={setBugMessage}
            multiline
            numberOfLines={4}
            style={styles.bugInput}
          />
          <Button title="Submit" onPress={handleReportBug} />
          <Button title="Cancel" onPress={toggleBugModal} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountEmail: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  accountInfo: {
    fontSize: 16,
    color: '#888',
  },
  preferencesContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  preferenceText: {
    fontSize: 16,
  },
  resourcesContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  resourceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resourceText: {
    fontSize: 16,
  },
  logoutContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  bugInput: {
    height: 100,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
});

export default ProfileScreen;
