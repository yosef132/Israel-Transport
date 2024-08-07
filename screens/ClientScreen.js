import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, TextInput, Modal, Text, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { AuthContext } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ClientScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://israeltransport.onrender.com/api/trips/GetAllTrips');
        setTrips(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleExpand = (item) => {
    setExpandedTrip(item);
  };

  const handleCollapse = () => {
    setExpandedTrip(null);
  };

  const handleBookBus = (tripID) => {
    if (user) {
      console.log('User:', user);
      console.log('User Id', user.ID);
      navigation.navigate('BookABus', { tripId: tripID });
    } else {
      alert('Please log in to book a bus!');
      navigation.navigate('WelcomeScreen');
    }
  };

  const renderTrip = ({ item }) => (
    <Card style={styles.tripCard} onPress={() => handleExpand(item)}>
      <Card.Cover source={require('../assets/images/trip1.jpg')} style={styles.image} />
      <Card.Content>
        <Title style={styles.title}>{item.TripName}</Title>
        <Paragraph style={styles.description}>{item.Description}</Paragraph>
        <Paragraph style={styles.details}>Trip category: {item.TripType}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleBookBus(item.TripID)} style={styles.bookButton}>Book a Bus</Button>
        <Button mode="outlined" onPress={() => handleExpand(item)} style={styles.expandButton}>Expand</Button>
      </Card.Actions>
    </Card>
  );

  const filteredTrips = trips.filter(trip =>
    trip.TripType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by category"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredTrips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.TripID.toString()}
        contentContainerStyle={styles.list}
      />

      {expandedTrip && (
        <Modal visible={true} transparent={true} animationType="slide">
          <BlurView intensity={210} style={styles.absolute}>
            <View style={styles.modalContainer}>
              <Card style={styles.expandedCard}>
                <Card.Cover source={require('../assets/images/trip1.jpg')} style={styles.expandedImage} />
                <Card.Content>
                  <Title style={styles.expandedTitle}>{expandedTrip.TripName}</Title>
                  <Paragraph style={styles.expandedDescription}>{expandedTrip.Description}</Paragraph>
                  <Paragraph style={styles.expandedDetails}>Route: {expandedTrip.TripType}</Paragraph>
                  <Title style={styles.hoursTitle}>Hours</Title>
                  {expandedTrip.OpenHour.map((openHour, index) => (
                    <Paragraph key={index} style={styles.hoursText}>
                      {`${daysOfWeek[index]}: ${openHour} - ${expandedTrip.CloseHour[index]}`}
                    </Paragraph>
                  ))}
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" onPress={handleCollapse} style={styles.collapseButton}>See Less</Button>
                </Card.Actions>
              </Card>
            </View>
          </BlurView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  list: {
    paddingBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#6c757d',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tripCard: {
    borderRadius: 15,
    marginBottom: 66,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  image: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#343a40',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  details: {
    fontSize: 12,
    color: '#adb5bd',
    marginBottom: 8,
  },
  bookButton: {
    marginRight: 8,
    backgroundColor: '#007bff',
    color: '#fff',
  },
  expandButton: {
    borderColor: '#007bff',
    color: '#007bff',
  

  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedCard: {
    width: width * 0.9,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  expandedImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  expandedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#343a40',
  },
  expandedDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  expandedDetails: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 8,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
  },
  hoursText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#6c757d',
  },
  collapseButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    color: '#fff',
  },
});

export default ClientScreen;
