import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Button, 
  TextInput, 
  List, 
  IconButton, 
  Dialog, 
  Portal, 
  Text,
  Chip,
  FAB,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthoritiesScreen() {
  const [authorities, setAuthorities] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Municipal', 'Safety', 'Infrastructure', 'Environment', 'Health', 'Transportation'];

  useEffect(() => {
    loadAuthorities();
  }, []);

  const loadAuthorities = async () => {
    try {
      const storedAuthorities = await AsyncStorage.getItem('authorities');
      if (storedAuthorities) {
        setAuthorities(JSON.parse(storedAuthorities));
      }
    } catch (error) {
      console.error('Error loading authorities:', error);
    }
  };

  const saveAuthorities = async (updatedAuthorities) => {
    try {
      await AsyncStorage.setItem('authorities', JSON.stringify(updatedAuthorities));
      setAuthorities(updatedAuthorities);
    } catch (error) {
      console.error('Error saving authorities:', error);
      Alert.alert('Error', 'Failed to save authorities');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddAuthority = () => {
    if (!name.trim() || !email.trim() || !category.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const newAuthority = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category,
    };

    const updatedAuthorities = [...authorities, newAuthority];
    saveAuthorities(updatedAuthorities);
    resetForm();
    setShowAddDialog(false);
  };

  const handleEditAuthority = () => {
    if (!name.trim() || !email.trim() || !category.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const updatedAuthorities = authorities.map(auth => 
      auth.id === editingAuthority.id 
        ? { ...auth, name: name.trim(), email: email.trim().toLowerCase(), category }
        : auth
    );

    saveAuthorities(updatedAuthorities);
    resetForm();
    setEditingAuthority(null);
  };

  const handleDeleteAuthority = (authority) => {
    Alert.alert(
      'Delete Authority',
      `Are you sure you want to delete ${authority.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedAuthorities = authorities.filter(auth => auth.id !== authority.id);
            saveAuthorities(updatedAuthorities);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setCategory('');
  };

  const openEditDialog = (authority) => {
    setEditingAuthority(authority);
    setName(authority.name);
    setEmail(authority.email);
    setCategory(authority.category);
  };

  const closeDialogs = () => {
    setShowAddDialog(false);
    setEditingAuthority(null);
    resetForm();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Authorities Directory</Title>
            <Text style={styles.subtitle}>
              Manage the authorities that can receive complaints
            </Text>
          </Card.Content>
        </Card>

        {authorities.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No authorities added yet. Tap the + button to add your first authority.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          authorities.map((authority) => (
            <Card key={authority.id} style={styles.card}>
              <List.Item
                title={authority.name}
                description={authority.email}
                left={() => <List.Icon icon="account" />}
                right={() => (
                  <View style={styles.actionButtons}>
                    <IconButton
                      icon="pencil"
                      onPress={() => openEditDialog(authority)}
                    />
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteAuthority(authority)}
                    />
                  </View>
                )}
              />
              <Card.Content style={styles.chipContainer}>
                <Chip mode="outlined" compact>
                  {authority.category}
                </Chip>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowAddDialog(true)}
        label="Add Authority"
      />

      <Portal>
        <Dialog visible={showAddDialog || editingAuthority !== null} onDismiss={closeDialogs}>
          <Dialog.Title>
            {editingAuthority ? 'Edit Authority' : 'Add New Authority'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Authority Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g., City Council"
            />
            
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g., council@city.gov"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.categoryLabel}>Category:</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  style={styles.categoryChip}
                  mode="outlined"
                >
                  {cat}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialogs}>Cancel</Button>
            <Button 
              onPress={editingAuthority ? handleEditAuthority : handleAddAuthority}
              mode="contained"
            >
              {editingAuthority ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  subtitle: {
    color: '#666',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  chipContainer: {
    paddingTop: 0,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginVertical: 8,
  },
  categoryLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    margin: 4,
  },
});