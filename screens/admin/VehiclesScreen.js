import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ Make: '', Model: '', Year: '', Km: '', vehicleType: '', carPlateNumber: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/vehicles/GetAllVehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.Make || !form.Model || !form.Year || !form.Km || !form.vehicleType || !form.carPlateNumber) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`https://israeltransport.onrender.com/api/vehicles/UpdateVehicle/${editingId}`, form);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await axios.post('https://israeltransport.onrender.com/api/vehicles/CreateVehicle', form);
        Alert.alert('Success', 'Vehicle created successfully');
      }
      setForm({ Make: '', Model: '', Year: '', Km: '', vehicleType: '', carPlateNumber: '' });
      setEditingId(null);
      fetchVehicles();
    } catch (error) {
      console.error('Error submitting vehicle:', error);
      Alert.alert('Error', 'Failed to submit vehicle');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (VehicleID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this vehicle?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(VehicleID),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (VehicleID) => {
    if (!VehicleID) {
      Alert.alert('Error', 'Vehicle ID is missing');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`https://israeltransport.onrender.com/api/vehicles/DeleteVehicle/${VehicleID}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      Alert.alert('Success', 'Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setForm(vehicle);
    setEditingId(vehicle.VehicleID);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          label="Make"
          value={form.Make}
          onChangeText={(value) => handleChange('Make', value)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#007AFF', underlineColor: 'transparent' } }}
        />
        <TextInput
          label="Model"
          value={form.Model}
          onChangeText={(value) => handleChange('Model', value)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#007AFF', underlineColor: 'transparent' } }}
        />
        <TextInput
          label="Year"
          value={form.Year}
          onChangeText={(value) => handleChange('Year', value)}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#007AFF', underlineColor: 'transparent' } }}
        />
        <TextInput
          label="Kilometers"
          value={form.Km}
          onChangeText={(value) => handleChange('Km', value)}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#007AFF', underlineColor: 'transparent' } }}
        />
        <TextInput
          label="Vehicle Type"
          value={form.vehicleType}
          onChangeText={(value) => handleChange('vehicleType', value)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#007AFF', underlineColor: 'transparent' } }}
        />
        <TextInput
          label="Car Plate Number"
          value={form.carPlateNumber}
          onChangeText={(value) => handleChange('carPlateNumber', value)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#007AFF', underlineColor: 'transparent' } }}
        />
        <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.button}>
          {editingId ? "Update Vehicle" : "Add Vehicle"}
        </Button>
      </View>

      {loading && <ActivityIndicator animating={true} size="large" color="#007AFF" />}

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item._id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.Make} {item.Model}</Title>
              <Paragraph>Year: {item.Year}</Paragraph>
              <Paragraph>Kilometers: {item.Km}</Paragraph>
              <Paragraph>Vehicle Type: {item.vehicleType}</Paragraph>
              <Paragraph>Car Plate Number: {item.carPlateNumber}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button color="#007AFF" onPress={() => handleEdit(item)}>Edit</Button>
              <Button color="#FF3B30" onPress={() => confirmDelete(item.VehicleID)}>Delete</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f4f7',
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
  card: {
    marginBottom: 16,
  },
});

export default VehiclesScreen;
