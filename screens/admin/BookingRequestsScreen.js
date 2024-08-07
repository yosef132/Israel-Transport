import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const BookingRequestsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentBooking, setCurrentBooking] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateField, setDateField] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`https://israeltransport.onrender.com/api/bookings/delete/${bookingID}`);
              setBookings(prevBookings => prevBookings.filter(booking => booking.BookingID !== bookingID));
            } catch (error) {
              console.error('Error deleting booking:', error);
              Alert.alert('Error', 'Failed to delete booking');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdate = (booking, type) => {
    setCurrentBooking(booking);
    setModalType(type);
    setModalVisible(true);
  };

  const updateBooking = async () => {
    try {
      await axios.put(`https://israeltransport.onrender.com/api/bookings/update/${currentBooking.BookingID}`, currentBooking);
      setModalVisible(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking');
    }
  };

  const showDatePicker = (field) => {
    setDateField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange = (date) => {
    setCurrentBooking({ ...currentBooking, [dateField]: date.toISOString() });
    hideDatePicker();
  };

  const renderStatusCircle = (status) => {
    let backgroundColor;

    switch (status) {
      case 'Pending':
        backgroundColor = 'orange';
        break;
      case 'Confirmed':
        backgroundColor = 'green';
        break;
      case 'Completed':
        backgroundColor = 'blue';
        break;
      case 'Cancelled':
        backgroundColor = 'red';
        break;
      default:
        backgroundColor = 'gray';
    }

    return <View style={[styles.statusCircle, { backgroundColor }]} />;
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <Text>Email: {item.Email}</Text>
      <Text>Phone: {item.PhoneNumber}</Text>
      <TouchableOpacity onPress={() => toggleExpand(item.BookingID)}>
        <Text style={styles.expandText}>{item.expanded ? 'Hide Details' : 'Show Details'}</Text>
      </TouchableOpacity>
      {item.expanded && (
        <>
          <Text>Booking ID: {item.BookingID}</Text>
          <Text>Full Name: {item.FullName}</Text>
          <Text>Vehicle ID: {item.VehicleID}</Text>
          <View style={styles.statusContainer}>
            {renderStatusCircle(item.status)}
            <Text>Status: {item.status}</Text>
          </View>
          <Text>Departure Time: {new Date(item.DepartureTime).toLocaleString()}</Text>
          <Text>Passengers: {item.Passengers}</Text>
          <Text>Pickup Address: {item.PickupAddress}</Text>
          <Text>Dropoff Address: {item.DropOffAddress}</Text>
          <Text>Notes: {item.notes}</Text>
          <Button title="Update Status" onPress={() => handleUpdate(item, 'status')} />
          <Button title="Update Dates" onPress={() => handleUpdate(item, 'dates')} />
          <Button title="Update Info" onPress={() => handleUpdate(item, 'info')} />
        </>
      )}
      <Button title="DELETE" onPress={() => handleDelete(item.BookingID)} />
    </View>
  );

  const toggleExpand = (bookingID) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.BookingID === bookingID ? { ...booking, expanded: !booking.expanded } : booking
      )
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderModalContent = () => {
    switch (modalType) {
      case 'status':
        return (
          <>
            <Text style={styles.modalTitle}>Update Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currentBooking.status}
                style={styles.picker}
                onValueChange={(itemValue) => setCurrentBooking({ ...currentBooking, status: itemValue })}
              >
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Confirmed" value="Confirmed" />
                <Picker.Item label="Cancelled" value="Cancelled" />
              </Picker>
            </View>
          </>
        );
      case 'dates':
        return (
          <>
            <Text style={styles.modalTitle}>Update Dates</Text>
            <TouchableOpacity onPress={() => showDatePicker('DepartureTime')}>
              <Text style={styles.datePickerText}>Departure Time: {new Date(currentBooking.DepartureTime).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showDatePicker('startTrailDate')}>
              <Text style={styles.datePickerText}>Start Trail Date: {new Date(currentBooking.startTrailDate).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showDatePicker('endTrailDate')}>
              <Text style={styles.datePickerText}>End Trail Date: {new Date(currentBooking.endTrailDate).toLocaleString()}</Text>
            </TouchableOpacity>
          </>
        );
      case 'info':
        return (
          <>
            <Text style={styles.modalTitle}>Update Info</Text>
            <TextInput
              placeholder="Full Name"
              value={currentBooking.FullName}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, FullName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={currentBooking.Email}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, Email: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              value={currentBooking.PhoneNumber}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, PhoneNumber: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Pickup Address"
              value={currentBooking.PickupAddress}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, PickupAddress: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Dropoff Address"
              value={currentBooking.DropOffAddress}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, DropOffAddress: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Passengers"
              value={String(currentBooking.Passengers)}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, Passengers: Number(text) })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Notes"
              value={currentBooking.notes}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, notes: text })}
              style={styles.input}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.BookingID.toString()}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
          <View style={styles.modalContent}>
            {renderModalContent()}
            <Button title="Update" onPress={updateBooking} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </ScrollView>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateChange}
        onCancel={hideDatePicker}
      />
    </View>
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  expandText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  modalScrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
});

export default BookingRequestsScreen;
