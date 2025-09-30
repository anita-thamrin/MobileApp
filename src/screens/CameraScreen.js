import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, IconButton, Text, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  // Loading state
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionDescription}>
          We need your permission to access the camera to take photos of issues you want to report.
        </Text>
        <Button 
          mode="contained" 
          onPress={requestPermission} 
          style={styles.permissionButton}
          icon="camera"
        >
          Grant Camera Permission
        </Button>
        <Button 
          mode="text" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        // Take the photo first
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        // Get location (optional - app works even if this fails)
        let location = null;
        try {
          // Request location permission if not granted
          let currentLocationPermission = locationPermission;
          if (!currentLocationPermission?.granted) {
            const result = await requestLocationPermission();
            currentLocationPermission = result;
          }

          if (currentLocationPermission?.granted) {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
              timeout: 5000,
            });
            if (loc && loc.coords) {
              location = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              };
            }
          }
        } catch (error) {
          console.log('Location not available:', error);
          // Continue without location - it's optional
        }

        // Navigate to complaint screen with photo and location (or null)
        navigation.navigate('Complaint', {
          photoUri: photo.uri,
          location: location,
        });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      />
      
      {/* Overlay UI with absolute positioning - NOT inside CameraView */}
      <View style={styles.overlayContainer}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <IconButton
            icon="close"
            iconColor="white"
            size={30}
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          />
          <Text style={styles.instructionText}>Position the issue in frame</Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomBar}>
          <IconButton
            icon="camera-flip"
            iconColor="white"
            size={30}
            onPress={toggleCameraFacing}
            style={styles.controlButton}
            disabled={isCapturing}
          />
          
          {isCapturing ? (
            <ActivityIndicator size={70} color="white" />
          ) : (
            <IconButton
              icon="camera"
              iconColor="white"
              size={70}
              onPress={takePicture}
              style={styles.captureButton}
            />
          )}
          
          <View style={styles.controlButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 60,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  permissionButton: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 12,
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: 60,
  },
  captureButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'white',
  },
});