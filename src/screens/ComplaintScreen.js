import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { TextInput, Button, Card, Title, Chip, Text } from "react-native-paper";
import * as Location from "expo-location";
import * as MailComposer from "expo-mail-composer";
import { useComplaints } from "../context/ComplaintsContext";

const CATEGORIES = [
  "Infrastructure",
  "Environment",
  "Public Safety",
  "Transport",
  "Health",
  "Education",
  "Utilities",
  "Other",
];

export default function ComplaintScreen({ route, navigation }) {
  const { photoUri, location: passedLocation } = route.params || {};
  const { addComplaint } = useComplaints();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(passedLocation || null);
  const [address, setAddress] = useState("");
  const [selectedAuthorities, setSelectedAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock authorities - replace with actual data from AsyncStorage or props
  const AUTHORITIES = [
    { id: "1", name: "City Council", email: "chechiatming@icloud.com" },
    { id: "2", name: "Police Department", email: "chechiatming@icloud.com" },
    { id: "3", name: "Public Works", email: "chechiatming@icloud.com" },
    { id: "4", name: "Environmental Agency", email: "chechiatming@icloud.com" },
  ];

  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    } else {
      getAddressFromCoords(location.latitude, location.longitude);
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      if (loc) {
        const locationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(locationData);
        getAddressFromCoords(locationData.latitude, locationData.longitude);
      }
    } catch (error) {
      console.error("Error getting location:", error);
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
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const toggleAuthority = (authority) => {
    setSelectedAuthorities((prev) => {
      const exists = prev.find((a) => a.id === authority.id);
      if (exists) {
        return prev.filter((a) => a.id !== authority.id);
      }
      return [...prev, authority];
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (selectedAuthorities.length === 0) {
      Alert.alert("Error", "Please select at least one authority");
      return;
    }

    setLoading(true);

    // Create complaint data
    const complaintData = {
      title: title.trim(),
      description: description.trim(),
      category,
      photoUri,
      location,
      address,
      authorities: selectedAuthorities,
    };

    // Save complaint locally
    addComplaint(complaintData);

    // Check if mail is available
    const isAvailable = await MailComposer.isAvailableAsync();

    if (!isAvailable) {
      setLoading(false);
      Alert.alert(
        "Email Not Available",
        "Your device does not have email configured. The complaint has been saved locally.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("MainTabs", { screen: "Home" }),
          },
        ]
      );
      return;
    }

    // Prepare email content
    const recipientEmails = selectedAuthorities.map((auth) => auth.email);
    const emailBody = `
COMPLAINT DETAILS
================

Category: ${category}
Title: ${title}

Description:
${description}

Location:
${address || "Location not available"}

Coordinates:
Latitude: ${location?.latitude || "N/A"}
Longitude: ${location?.longitude || "N/A"}

---
Submitted via Complain King App
    `.trim();

    try {
      // Open email composer
      const result = await MailComposer.composeAsync({
        recipients: recipientEmails,
        subject: `Complaint: ${title}`,
        body: emailBody,
        attachments: photoUri ? [photoUri] : [],
      });

      setLoading(false);

      if (result.status === "sent") {
        Alert.alert(
          "Success!",
          "Your complaint email has been sent successfully.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("MainTabs", { screen: "Home" }),
            },
          ]
        );
      } else if (result.status === "cancelled") {
        Alert.alert(
          "Email Cancelled",
          "Your complaint has been saved locally, but the email was not sent.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("MainTabs", { screen: "Home" }),
            },
          ]
        );
      } else {
        Alert.alert(
          "Complaint Saved",
          "Your complaint has been saved locally.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("MainTabs", { screen: "Home" }),
            },
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error composing email:", error);
      Alert.alert(
        "Error",
        "Failed to open email composer, but your complaint has been saved locally.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("MainTabs", { screen: "Home" }),
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Submit Complaint</Title>

          {/* Photo Preview */}
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          )}

          {/* Title Input */}
          <TextInput
            label="Complaint Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          {/* Description Input */}
          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          {/* Category Selection */}
          <Text style={styles.label}>Category *</Text>
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

          {/* Location Info */}
          {address && (
            <View style={styles.locationContainer}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.address}>{address}</Text>
            </View>
          )}

          {/* Authority Selection */}
          <Text style={styles.label}>Select Authorities *</Text>
          <View style={styles.chipContainer}>
            {AUTHORITIES.map((authority) => (
              <Chip
                key={authority.id}
                selected={
                  !!selectedAuthorities.find((a) => a.id === authority.id)
                }
                onPress={() => toggleAuthority(authority)}
                style={styles.chip}
              >
                {authority.name}
              </Chip>
            ))}
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Submit Complaint
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 16,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    margin: 4,
  },
  locationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
