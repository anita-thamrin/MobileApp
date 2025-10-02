import * as Location from "expo-location";
import * as MailComposer from "expo-mail-composer";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, TextInput, Title } from "react-native-paper";
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
    { id: "1", name: "Town Council", email: "chechiatming@icloud.com" },
    {
      id: "2",
      name: "Singapore Police Force",
      email: "chechiatming@icloud.com",
    },
    { id: "3", name: "LTA", email: "chechiatming@icloud.com" },
    { id: "4", name: "NEA", email: "chechiatming@icloud.com" },
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

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (loc) {
        const locationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
        };
        setLocation(locationData);
        getAddressFromCoords(locationData.latitude, locationData.longitude);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      console.log("Getting address for coordinates:", latitude, longitude);

      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      console.log(
        "Reverse geocode result:",
        JSON.stringify(addresses, null, 2)
      );

      if (addresses && addresses.length > 0) {
        const addr = addresses[0];

        // Build address with all available fields
        // Singapore addresses typically have: name, street, district, city, region, postalCode, country
        const addressParts = [];

        // Try different field combinations for better Singapore address formatting
        if (addr.name && addr.name !== addr.street) {
          addressParts.push(addr.name);
        }
        if (addr.streetNumber) {
          addressParts.push(addr.streetNumber);
        }
        if (addr.street) {
          addressParts.push(addr.street);
        }
        if (addr.district) {
          addressParts.push(addr.district);
        }
        if (addr.subregion) {
          addressParts.push(addr.subregion);
        }
        if (addr.city) {
          addressParts.push(addr.city);
        }
        if (addr.region && addr.region !== addr.city) {
          addressParts.push(addr.region);
        }
        if (addr.postalCode) {
          addressParts.push(addr.postalCode);
        }
        if (addr.country) {
          addressParts.push(addr.country);
        }

        const formattedAddress = addressParts
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .join(", ");

        console.log("Formatted address:", formattedAddress);

        if (formattedAddress && formattedAddress !== addr.country) {
          setAddress(formattedAddress);
        } else {
          // Fallback to coordinates if no detailed address
          setAddress(
            `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
          );
        }
      } else {
        console.log("No addresses found");
        setAddress(
          `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
        );
      }
    } catch (error) {
      console.error("Error getting address:", error);
      // Fallback to showing coordinates
      setAddress(`Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`);
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
              {location && location.accuracy && (
                <Text style={styles.accuracy}>
                  Accuracy: ±{Math.round(location.accuracy)}m
                </Text>
              )}
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
  accuracy: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
