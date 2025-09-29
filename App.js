import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Correct import paths - App.js is in root, screens are in src/screens/
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ComplaintScreen from './src/screens/ComplaintScreen';
import AuthoritiesScreen from './src/screens/AuthoritiesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Complain King' }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen} 
            options={{ title: 'Take Photo' }}
          />
          <Stack.Screen 
            name="Complaint" 
            component={ComplaintScreen} 
            options={{ title: 'Submit Complaint' }}
          />
          <Stack.Screen 
            name="Authorities" 
            component={AuthoritiesScreen} 
            options={{ title: 'Manage Authorities' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}