import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, FAB } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Welcome to Complain King</Title>
            <Paragraph>
              Report issues to authorities quickly and efficiently with photo evidence and location data.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Camera')}
                style={styles.button}
                icon="camera"
              >
                Take Photo & Report
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Complaint')}
                style={styles.button}
                icon="file-document-edit"
              >
                Write Complaint
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Authorities')}
                style={styles.button}
                icon="account-group"
              >
                Manage Authorities
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Complaints</Title>
            <Paragraph>No complaints submitted yet.</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Camera')}
        label="Quick Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});