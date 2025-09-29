import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Title, 
  Chip, 
  Text,
  Paragraph 
} from 'react-native-paper';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ComplaintScreen({ route, navigation }) {
  const [complaint, setComplaint] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedAuthorities, setSelectedAuthorities] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMailAvailable, setIsMailAvailable] = useState(false);

  const { photoUri, location } = route.params || {};

  useEffect(() => {
    loadAuthorities();
    checkMailAvailability();
  }, []);

  const checkMailAvailability = async () => {
    const available = await MailComposer.isAvailableAsync();
    setIsMailAvailable(available);
  };

  const loadAuthorities = async () => {
    try {
      const storedAuthorities = await AsyncStorage.getItem('authorities');
      if (storedAuthorities) {
        setAuthorities(JSON.parse(storedAuthorities));
      } else {
        const defaultAuthorities = [
          { id: '1', name: 'City Council', email: 'council@city.gov', category: 'Municipal' },
          { id: '2', name: 'Police Department', email: 'reports@police.gov', category: 'Safety' },
          { id: '3', name: 'Public Works', email: 'works@city.gov', category: 'Infrastructure' },
          { id: '4', name: 'Environmental Agency', email: 'env@epa.gov', category: 'Environment' },
        ];
        setAuthorities(defaultAuthorities);
        await AsyncStorage.setItem('authorities', JSON.stringify(defaultAuthorities));
      }
    } catch (error) {
      console.error('Error loading authorities:', error);
    }
  };

  const toggleAuthority = (authority) => {
    setSelectedAuthorities(prev => {
      const isSelected = prev.find(a => a.id === authority.id);
      if (isSelected) {
        return prev.filter(a => a.id !== authority.id);
      } else {
        return [...prev, authority];
      }
    });
  };

  const formatLocationText = () => {
    if (!location) return 'Location not available';
    
    const { coords, address } = location;
    let locationText = `Coordinates: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
    
    if (address) {
      locationText += `\nAddress: ${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.postalCode || ''}`;
    }
    
    return locationText;
  };

  const submitComplaint = async () => {
    if (!complaint.trim()) {
      Alert.alert('Error', 'Please enter a complaint description');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    if (selectedAuthorities.length === 0) {
      Alert.alert('Error', 'Please select at least one authority');
      return;
    }

    if (!isMailAvailable) {
      Alert.alert('Error', 'Mail app is not available on this device');
      return;
    }

    setLoading(true);

    try {
      const recipients = selectedAuthorities.map(auth => auth.email);
      const locationText = formatLocationText();
      
      const body = `
Dear Authority,

${complaint}

Location Information:
${locationText}

Submitted via Complain King App
Date: ${new Date().toLocaleString()}

Best regards,
Concerned Citizen
      `;

      const mailOptions = {
        recipients: recipients,
        subject: subject,
        body: body,
        attachments: photoUri ? [photoUri] : [],
      };

      const result = await MailComposer.composeAsync(mailOptions);
      
      if (result.status === 'sent') {
        Alert.alert('Success', 'Complaint sent successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } else {
        Alert.alert('Info', 'Complaint composition cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send complaint: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Complaint Details</Title>
          
          <TextInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            mode="outlined"
            style={styles.input}
            placeholder="Brief description of the issue"
          />

          <TextInput
            label="Detailed Complaint"
            value={complaint}
            onChangeText={setComplaint}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            placeholder="Describe the issue in detail..."
          />
        </Card.Content>
      </Card>

      {photoUri && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Photo Evidence</Title>
            <Image source={{ uri: photoUri }} style={styles.photo} />
          </Card.Content>
        </Card>
      )}

      {location && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Location Information</Title>
            <Text style={styles.locationText}>{formatLocationText()}</Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Select Recipients</Title>
          <Paragraph style={styles.subtitle}>
            Choose which authorities should receive this complaint:
          </Paragraph>
          
          <View style={styles.authoritiesContainer}>
            {authorities.map((authority) => (
              <Chip
                key={authority.id}
                selected={!!selectedAuthorities.find(a => a.id === authority.id)}
                onPress={() => toggleAuthority(authority)}
                style={styles.chip}
                mode="outlined"
              >
                {authority.name} ({authority.category})
              </Chip>
            ))}
          </View>

          {selectedAuthorities.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedTitle}>Selected Recipients:</Text>
              {selectedAuthorities.map((auth) => (
                <Text key={auth.id} style={styles.selectedEmail}>
                  • {auth.name}: {auth.email}
                </Text>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={submitComplaint}
          style={styles.submitButton}
          loading={loading}
          disabled={loading || !isMailAvailable}
          icon="send"
        >
          {loading ? 'Sending...' : 'Submit Complaint'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Authorities')}
          style={styles.manageButton}
          icon="account-group"
        >
          Manage Authorities
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
  input: {
    marginVertical: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  subtitle: {
    marginVertical: 8,
    color: '#666',
  },
  authoritiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    margin: 4,
  },
  selectedContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  selectedTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedEmail: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  buttonContainer: {
    padding: 16,
  },
  submitButton: {
    marginVertical: 8,
  },
  manageButton: {
    marginVertical: 8,
  },
});