import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Chip, Text } from 'react-native-paper';
import * as Location from 'expo-location';
import { useComplaints } from '../context/ComplaintsContext';

const CATEGORIES = [
  'Infrastructure', 'Environment', 'Public Safety', 'Transport', 
  'Health', 'Education', 'Utilities', 'Other'
];

export default function ComplaintScreen({ route, navigation }) {
  const { photoUri, location: passedLocation } = route.params || {};
  const { addComplaint } = useComplaints();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(passedLocation || null);
  const [address, setAddress] = useState('');
  const [selectedAuthorities, setSelectedAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If location was passed from camera, get the address
    if (passedLocation && passedLocation.latitude && passedLocation.longitude) {
      getAddressFromCoords(passedLocation.latitude, passedLocation.longitude);
    } else {
      // Otherwise try to get current location
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000,
      });
      
      if (loc && loc.coords) {
        const locationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(locationData);
        getAddressFromCoords(locationData.latitude, locationData.longitude);
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        const formattedAddress = [
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country
        ].filter(Boolean).join(', ');
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.log('Error getting address:', error);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);
    
    // Create the complaint data
    const complaintData = {
      title: title.trim(),
      description: description.trim(),
      category,
      photoUri,
      location,
      address,
      authorities: selectedAuthorities,
    };
    
    // Save the complaint
    addComplaint(complaintData);
    
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your complaint has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('MainTabs', { screen: 'Home' });
            },
          },
        ]
      );
    }, 1000);
  };

  const toggleAuthority = (authority) => {
    setSelectedAuthorities(prev => {
      const exists = prev.find(a => a.id === authority.id);
      if (exists) {
        return prev.filter(a => a.id !== authority.id);
      }
      return [...prev, authority];
    });
  };

  // Mock authorities - replace with actual data
  const authorities = [
    { id: 1, name: 'City Council', email: 'council@city.gov' },
    { id: 2, name: 'Public Works', email: 'works@city.gov' },
    { id: 3, name: 'Health Department', email: 'health@city.gov' },
  ];

  return (
    <ScrollView style={styles.container}>
      {photoUri && (
        <Card style={styles.card}>
          <Card.Content>
            <Image source={{ uri: photoUri }} style={styles.image} />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Complaint Details</Title>
          
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Pothole on Main Street"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Describe the issue in detail..."
          />

          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipContainer}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                selected={category === cat}
                onPress={() => setCategory(cat)}
                style={styles.chip}
              >
                {cat}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Location</Title>
          {location && location.latitude && location.longitude ? (
            <>
              <Text style={styles.locationText}>
                📍 Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
              </Text>
              {address ? (
                <Text style={styles.addressText}>{address}</Text>
              ) : null}
            </>
          ) : (
            <Text style={styles.locationText}>📍 Location not available</Text>
          )}
          <Button
            mode="text"
            onPress={getCurrentLocation}
            style={styles.refreshButton}
          >
            Refresh Location
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Select Authorities</Title>
          <View style={styles.chipContainer}>
            {authorities.map((authority) => (
              <Chip
                key={authority.id}
                selected={!!selectedAuthorities.find(a => a.id === authority.id)}
                onPress={() => toggleAuthority(authority)}
                style={styles.chip}
              >
                {authority.name}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Submit Complaint
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    marginTop: 8,
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  refreshButton: {
    marginTop: 8,
  },
  buttonContainer: {
    margin: 16,
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 6,
  },
});