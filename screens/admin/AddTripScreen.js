import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator, Portal, Modal, Provider } from 'react-native-paper';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const initialFormState = {
  TripName: '',
  TripType: '',
  OpenHour: ["", "", "", "", "", "", ""],
  CloseHour: ["", "", "", "", "", "", ""],
  Description: ''
};

const AddTripScreen = () => {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [currentField, setCurrentField] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/trips/GetAllTrips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value, index) => {
    if (index !== undefined) {
      setForm({ ...form, [name]: form[name].map((v, i) => (i === index ? value : v)) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!form.TripName || !form.TripType || !form.Description) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    const openHour = form.OpenHour.map((time) => time || "Closed");
    const closeHour = form.CloseHour.map((time) => time || "Closed");

    setLoading(true);
    try {
      const payload = { ...form, OpenHour: openHour, CloseHour: closeHour };

      if (editingId) {
        await axios.put(`https://israeltransport.onrender.com/api/trips/UpdateTrip/${editingId}`, payload);
        Alert.alert('Success', 'Trip updated successfully');
      } else {
        await axios.post('https://israeltransport.onrender.com/api/trips/CreateTrip', payload);
        Alert.alert('Success', 'Trip created successfully');
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchTrips();
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting trip:', error);
      Alert.alert('Error', 'Failed to submit trip');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (tripId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(tripId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (tripId) => {
    if (!tripId) {
      Alert.alert('Error', 'Trip ID is missing');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`https://israeltransport.onrender.com/api/trips/DeleteTrip/${tripId}`);
      Alert.alert('Success', 'Trip deleted successfully');
      fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      Alert.alert('Error', 'Failed to delete trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip) => {
    setForm({
      TripName: trip.TripName,
      TripType: trip.TripType,
      OpenHour: Array.isArray(trip.OpenHour) ? trip.OpenHour : ["", "", "", "", "", "", ""],
      CloseHour: Array.isArray(trip.CloseHour) ? trip.CloseHour : ["", "", "", "", "", "", ""],
      Description: trip.Description,
    });
    setEditingId(trip.TripID);
    setModalVisible(true);
  };

  const showTimePicker = (index, field) => {
    setCurrentDayIndex(index);
    setCurrentField(field);
    setTimePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    handleChange(currentField, formattedTime, currentDayIndex);
    setTimePickerVisibility(false);
  };

  const renderTrip = ({ item }) => {
    const openHours = Array.isArray(item.OpenHour) ? item.OpenHour : ["Closed", "Closed", "Closed", "Closed", "Closed", "Closed", "Closed"];
    const closeHours = Array.isArray(item.CloseHour) ? item.CloseHour : ["Closed", "Closed", "Closed", "Closed", "Closed", "Closed", "Closed"];

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.TripName}</Title>
          <Paragraph>Type: {item.TripType}</Paragraph>
          <Paragraph>Open Hours: {openHours.join(', ')}</Paragraph>
          <Paragraph>Close Hours: {closeHours.join(', ')}</Paragraph>
          <Paragraph>Description: {item.Description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => handleEdit(item)}>Edit</Button>
          <Button onPress={() => confirmDelete(item.TripID)}>Delete</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.TripID.toString()}
          renderItem={renderTrip}
          ListEmptyComponent={() => <Paragraph style={styles.noTripsText}>No trips available</Paragraph>}
        />
        <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>
          Add a Trip
        </Button>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Button onPress={() => setModalVisible(false)} style={styles.backButton}>
                Back
              </Button>
              <TextInput
                label="Trip Name"
                value={form.TripName}
                onChangeText={(value) => handleChange('TripName', value)}
                style={styles.input}
              />
              <TextInput
                label="Trip Type"
                value={form.TripType}
                onChangeText={(value) => handleChange('TripType', value)}
                style={styles.input}
              />
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <View key={day} style={styles.timeInputContainer}>
                  <Button onPress={() => showTimePicker(index, 'OpenHour')} style={styles.timePickerButton}>
                    Open Hour ({day}): {form.OpenHour[index]}
                  </Button>
                  <Button onPress={() => showTimePicker(index, 'CloseHour')} style={styles.timePickerButton}>
                    Close Hour ({day}): {form.CloseHour[index]}
                  </Button>
                </View>
              ))}
              <TextInput
                label="Description"
                value={form.Description}
                onChangeText={(value) => handleChange('Description', value)}
                multiline
                style={styles.input}
              />
              <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.button}>
                {editingId ? "Update Trip" : "Add Trip"}
              </Button>
            </ScrollView>
          </Modal>
        </Portal>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={() => setTimePickerVisibility(false)}
        />

        {loading && <ActivityIndicator animating={true} size="large" />}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  noTripsText: {
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
  card: {
    marginBottom: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  modalContent: {
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timePickerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default AddTripScreen;
