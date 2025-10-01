import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Title, Paragraph, Chip, Text } from "react-native-paper";
import { useComplaints } from "../context/ComplaintsContext";

export default function HomeScreen({ navigation }) {
  const { complaints } = useComplaints();

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#F57C88";
      case "In Progress":
        return "#197602";
      case "Resolved":
        return "#388E3C";
      default:
        return "#666";
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Welcome to Complain King</Title>
            <Paragraph>
              Report issues to authorities quickly and efficiently with photo
              evidence and location data.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => {
                  // Navigate to the Report tab (CameraScreen)
                  navigation.navigate("Report");
                }}
                style={styles.button}
                icon="camera"
              >
                Take Photo & Report
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.navigate("Complaint")}
                style={styles.button}
                icon="file-document-edit"
              >
                Write Complaint
              </Button>

              <Button
                mode="outlined"
                onPress={() => navigation.navigate("Authorities")}
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
            {complaints.length === 0 ? (
              <Paragraph>No complaints submitted yet.</Paragraph>
            ) : (
              complaints.slice(0, 3).map((complaint) => (
                <Card key={complaint.id} style={styles.complaintCard}>
                  <Card.Content>
                    <View style={styles.complaintHeader}>
                      <Text style={styles.complaintTitle}>
                        {complaint.title}
                      </Text>
                      <Chip
                        mode="flat"
                        style={[
                          styles.statusChip,
                          { backgroundColor: getStatusColor(complaint.status) },
                        ]}
                        textStyle={styles.statusText}
                      >
                        {complaint.status}
                      </Chip>
                    </View>
                    <Text style={styles.complaintCategory}>
                      {complaint.category}
                    </Text>
                    <Text style={styles.complaintDate}>
                      {formatDate(complaint.createdAt)}
                    </Text>
                    {complaint.description && (
                      <Paragraph
                        numberOfLines={2}
                        style={styles.complaintDescription}
                      >
                        {complaint.description}
                      </Paragraph>
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
            {complaints.length > 3 && (
              <Button
                mode="text"
                onPress={() => {}}
                style={styles.viewAllButton}
              >
                View All Complaints ({complaints.length})
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  complaintCard: {
    marginTop: 12,
    backgroundColor: "#fff",
    elevation: 1,
  },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  complaintCategory: {
    fontSize: 12,
    color: "#6200ee",
    fontWeight: "500",
    marginBottom: 2,
  },
  complaintDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  complaintDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusChip: {
    height: 36,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  viewAllButton: {
    marginTop: 8,
  },
});
