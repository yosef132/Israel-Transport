import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import { Card, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://israeltransport.onrender.com/api/trips/GetAllTrips`);
      const filteredTrips = response.data.filter(trip =>
        trip.TripName.toLowerCase().includes(query.toLowerCase())
      );
      setTrips(filteredTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const renderTrip = ({ item }) => (
    <Card containerStyle={styles.tripCard}>
      <Card.Image source={require('../assets/images/trip1.jpg')} style={styles.image} />
      <Card.Title style={styles.title}>{item.TripName}</Card.Title>
      <Text style={styles.description}>{item.Description}</Text>
      <Text style={styles.details}>Type: {item.TripType}</Text>
      <Button
        title="Book a Bus"
        buttonStyle={styles.bookButton}
        onPress={() => navigation.navigate('BookABus', { tripId: item.TripID })}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by trip name"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.TripID.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
  tripCard: {
    borderRadius: 8,
    padding: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  details: {
    fontSize: 12,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default SearchScreen;
