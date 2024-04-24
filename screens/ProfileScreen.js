import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { supabase } from "../supabaseClient";

// Import Airtable API
import { AirtableApiKey, AirtableBaseId } from "../airtableconfig"; // Assuming you have a config file

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const handleAuthStateChange = (event, session) => {
      if (session && session.user) {
        setUserEmail(session.user.email);
        fetchRecords(session.user.email);
      } else {
        setUserEmail("");
        navigation.navigate("Home");
      }
    };

    const authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const fetchRecords = async (email) => {
    setLoading(true);
    try {
      const url = `https://api.airtable.com/v0/${AirtableBaseId}/Profiles`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AirtableApiKey}`,
        },
      });
      const data = await response.json();
      console.log("Fetched data:", data); // Add this line for debugging
      const userRecords = data.records.filter(
        (record) => record.fields.Email === email
      );
      setRecords(userRecords || []); // Set only the records that match the user's email
    } catch (error) {
      console.error("Error fetching records from Airtable:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      Alert.alert("Success", "Password updated successfully.");
      setNewPassword(""); // Clear the password input field
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.userInfo}>Email: {userEmail}</Text>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text>Loading...</Text>
        ) : records.length === 0 ? (
          <Text>No records found</Text>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.record}>
              <Text>Email: {record.fields.Email}</Text>
              <Text>Name: {record.fields.Name}</Text>
              <Text>About Me: {record.fields.AboutMe}</Text>
              {record.fields.picture && (
                <Image
                  source={{ uri: record.fields.Picture[0].url }}
                  style={styles.image}
                />
              )}
            </View>
          ))
        )}
      </ScrollView>
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        placeholder="Enter new password"
        secureTextEntry={true}
      />
      <Button
        title={loading ? "Updating..." : "Update Password"}
        onPress={handleUpdatePassword}
        disabled={loading}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    marginBottom: 20,
  },
  record: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default ProfileScreen;
