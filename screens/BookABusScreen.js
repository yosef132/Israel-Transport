import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Input, Button, Card, Text, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { AuthContext } from '../contexts/AuthContext';

const BookABusScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const { tripId } = route.params;

  const [formData, setFormData] = useState({
    bookingTypeID: 1,
    vehicleID: '',
    status: 'Pending',
    departureTime: new Date(),
    startTrailDate: new Date(),
    endTrailDate: new Date(),
    passengers: '',
    pickupAddress: '',
    dropoffAddress: '',
    fullName: '',
    email: '',
    phone: '',
    stopStations: '',
    notes: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTrailPicker, setShowStartTrailPicker] = useState(false);
  const [showEndTrailPicker, setShowEndTrailPicker] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [bookingTypes, setBookingTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available vehicles and booking types
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://israeltransport.onrender.com/api/vehicles/GetAllVehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    const fetchBookingTypes = async () => {
      try {
        const response = await axios.get('https://israeltransport.onrender.com/api/bookingtypes/GetAllBookingTypes');
        setBookingTypes(response.data);
      } catch (error) {
        console.error('Error fetching booking types:', error);
      }
    };

    fetchVehicles();
    fetchBookingTypes();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event, selectedDate, field) => {
    const currentDate = selectedDate || formData[field];
    if (field === 'departureTime') setShowDatePicker(false);
    if (field === 'startTrailDate') setShowStartTrailPicker(false);
    if (field === 'endTrailDate') setShowEndTrailPicker(false);
    setFormData({ ...formData, [field]: currentDate });
  };

  const handleSubmit = async () => {
    if (!user || !user.userID) {
      navigation.navigate('WelcomeScreen');
      return;
    }

    setLoading(true);

    const bookingData = {
      BookingID: Math.floor(Math.random() * 1000000), // Generate a unique BookingID
      UserID: user.userID,
      VehicleID: parseInt(formData.vehicleID, 10),
      status: formData.status,
      DepartureTime: formData.departureTime.toISOString(),
      startTrailDate: formData.startTrailDate.toISOString(),
      endTrailDate: formData.endTrailDate.toISOString(),
      Passengers: parseInt(formData.passengers, 10),
      PickupAddress: formData.pickupAddress,
      DropOffAddress: formData.dropoffAddress,
      FullName: formData.fullName,
      Email: formData.email,
      PhoneNumber: formData.phone,
      stopStations: formData.stopStations.split(',').map(station => station.trim()),
      notes: formData.notes
    };

    console.log('Booking Data:', bookingData); // Log the booking data for debugging

    try {
      const response = await axios.post('https://israeltransport.onrender.com/api/bookings/create', bookingData);

      if (response.status === 201) {
        alert('Booking successfully created!');
        navigation.navigate('ClientScreen');
      } else {
        alert('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.title}>Book A Bus</Card.Title>
        <Card.Divider />

        <Text style={styles.label}>Booking Type</Text>
        <RNPickerSelect
          onValueChange={(value) => handleChange('bookingTypeID', value)}
          items={bookingTypes.map((type) => ({ label: type.TypeName, value: type.BookingTypeID }))}
          style={pickerSelectStyles}
          value={formData.bookingTypeID}
          placeholder={{ label: 'Select Booking Type', value: null }}
        />

        <Text style={styles.label}>Vehicle</Text>
        <RNPickerSelect
          onValueChange={(value) => handleChange('vehicleID', value)}
          items={vehicles.map((vehicle) => ({ label: `${vehicle.make} ${vehicle.model}`, value: vehicle.VehicleID }))}
          style={pickerSelectStyles}
          value={formData.vehicleID}
          placeholder={{ label: 'Select Vehicle', value: null }}
        />

        <Input
          label="Passengers"
          value={formData.passengers}
          onChangeText={(text) => handleChange('passengers', text)}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>Departure Time: {formData.departureTime.toDateString()}</Text>
          <Icon name="calendar" type="font-awesome" color="#007AFF" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.departureTime}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'departureTime')}
          />
        )}

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowStartTrailPicker(true)}>
          <Text style={styles.dateText}>Start Trail Date: {formData.startTrailDate.toDateString()}</Text>
          <Icon name="calendar" type="font-awesome" color="#007AFF" />
        </TouchableOpacity>
        {showStartTrailPicker && (
          <DateTimePicker
            value={formData.startTrailDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'startTrailDate')}
          />
        )}

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowEndTrailPicker(true)}>
          <Text style={styles.dateText}>End Trail Date: {formData.endTrailDate.toDateString()}</Text>
          <Icon name="calendar" type="font-awesome" color="#007AFF" />
        </TouchableOpacity>
        {showEndTrailPicker && (
          <DateTimePicker
            value={formData.endTrailDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'endTrailDate')}
          />
        )}

        <Input
          label="Pick up address"
          value={formData.pickupAddress}
          onChangeText={(text) => handleChange('pickupAddress', text)}
          style={styles.input}
        />
        <Input
          label="Drop off address"
          value={formData.dropoffAddress}
          onChangeText={(text) => handleChange('dropoffAddress', text)}
          style={styles.input}
        />
        <Input
          label="Full name"
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          style={styles.input}
        />
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          style={styles.input}
          keyboardType="email-address"
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <Input
          label="Stop Stations (comma separated)"
          value={formData.stopStations}
          onChangeText={(text) => handleChange('stopStations', text)}
          style={styles.input}
        />
        <Input
          label="Notes"
          value={formData.notes}
          onChangeText={(text) => handleChange('notes', text)}
          style={styles.input}
        />

        <Button
          title="Get a Quote Now!"
          onPress={handleSubmit}
          buttonStyle={styles.button}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
      </Card>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
  },
});

export default BookABusScreen;
