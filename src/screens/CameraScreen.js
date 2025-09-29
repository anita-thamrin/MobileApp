import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Button, ActivityIndicator } from 'react-native-paper';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      let address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (address.length > 0) {
        setLocation({
          ...currentLocation,
          address: address[0],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        navigation.navigate('Complaint', {
          photoUri: photo.uri,
          location: location,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setLoading(false);
      }
    }
  };

  const flipCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need camera permission to take photos</Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            {location && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  📍 Location detected
                </Text>
                {location.address && (
                  <Text style={styles.addressText}>
                    {location.address.street}, {location.address.city}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.bottomBar}>
            <Button
              mode="contained"
              onPress={flipCamera}
              style={styles.flipButton}
              icon="camera-flip"
            >
              Flip
            </Button>

            <Button
              mode="contained"
              onPress={takePicture}
              style={styles.captureButton}
              disabled={loading}
              icon="camera"
              loading={loading}
            >
              {loading ? 'Taking...' : 'Capture'}
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topBar: {
    padding: 20,
    paddingTop: 40,
  },
  locationInfo: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressText: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  captureButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  flipButton: {
    marginRight: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
});