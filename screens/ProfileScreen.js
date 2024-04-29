import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { Layout, Text, Card, Avatar, Button } from "@ui-kitten/components";
import { supabase } from "../supabaseClient";
import { AirtableApiKey, AirtableBaseId } from "../airtableconfig";

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authListener;
    let error;

    try {
      const { data: listenerData, error: listenerError } =
        supabase.auth.onAuthStateChange((event, session) => {
          if (session && session.user) {
            setUserEmail(session.user.email);
            fetchRecords(session.user.email);
          } else {
            setUserEmail("");
            navigation.navigate("Login");
          }
        });

      authListener = listenerData;
      error = listenerError;
    } catch (err) {
      error = err;
    }

    if (error) {
      console.error("Failed to set up auth listener:", error.message);
    }

    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const fetchRecords = async (email) => {
    try {
      const url = `https://api.airtable.com/v0/${AirtableBaseId}/Profiles?filterByFormula=Email="${email}"`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${AirtableApiKey}` },
      });
      const data = await response.json();
      if (data.records.length === 0) {
        Alert.alert("No Data", "No profile data found for this user.");
      } else {
        setRecords(data.records);
      }
    } catch (error) {
      console.error("Error fetching records from Airtable:", error);
      Alert.alert("Error", "Failed to fetch profile data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out Error", error.message);
    } else {
      navigation.replace("Login"); // Use replace to avoid going back to profile after sign out
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchRecords(userEmail);
  };

  return (
    <Layout style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {records.map((record) => (
            <Card style={styles.card} key={record.id}>
              <Avatar
                source={{ uri: record.fields.Picture }}
                style={styles.image}
              />
              <Text category="h6">
                {record.fields.FirstName} {record.fields.LastName}
              </Text>
              <Text>Email: {record.fields.Email}</Text>
              <Text>About Me: {record.fields.AboutMe}</Text>
              <Button
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    onUpdate: handleRefresh,
                  })
                }
              >
                Edit Profile
              </Button>
            </Card>
          ))}
          <View style={styles.buttonContainer}>
            <Button
              style={[styles.button, styles.refreshButton]}
              onPress={handleRefresh}
              size="small"
            >
              Refresh
            </Button>
            <Button
              style={[styles.button, styles.signOutButton]}
              onPress={handleSignOut}
              size="small"
            >
              Sign Out
            </Button>
          </View>
        </ScrollView>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  refreshButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  signOutButton: {
    backgroundColor: "#ef476f",
    borderColor: "#ef476f",
  },
});

export default ProfileScreen;
