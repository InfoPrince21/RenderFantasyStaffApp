import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import {
  Layout,
  Text,
  Card,
  Avatar,
  Button,
  useTheme,
} from "@ui-kitten/components";
import { ThemeContext } from "../theme-context";
import { supabase } from "../supabaseClient";
import { AirtableApiKey, AirtableBaseId } from "../airtableconfig";

const ProfileScreen = ({ navigation }) => {
  const themeContext = useContext(ThemeContext);
  const theme = useTheme();
  const [userEmail, setUserEmail] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let authListener;

    const handleAuthStateChange = (event, session) => {
      if (session && session.user) {
        setUserEmail(session.user.email);
        fetchRecords(session.user.email);
      } else {
        setUserEmail("");
        // navigation.navigate("Login");
      }
    };

    try {
      authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);
    } catch (err) {
      console.error("Failed to set up auth listener:", err.message);
    }

    // return () => {
    //   if (authListener) {
    //     authListener.unsubscribe();
    //   }
    // };
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
    try {
      await supabase.auth.signOut();
      // setUserEmail("");
      // navigation.navigate("Home");
    } catch (error) {
      console.error("Error signing out:", error.message);
      Alert.alert("Sign Out Failed", error.message || "Failed to sign out.");
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchRecords(userEmail);
  };

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="large" color={theme["text-basic-color"]} />
      ) : (
        <ScrollView>
          {records.map((record) => (
            <Card style={styles.card} key={record.id}>
              <Avatar
                source={{ uri: record.fields.Picture }}
                style={styles.image}
              />
              <Text category="h6" style={{ color: theme["text-basic-color"] }}>
                {record.fields.FirstName} {record.fields.LastName}
              </Text>
              <Text style={{ color: theme["text-basic-color"] }}>
                Email: {record.fields.Email}
              </Text>
              <Text style={{ color: theme["text-basic-color"] }}>
                About Me: {record.fields.AboutMe}
              </Text>
              <Button onPress={() => navigation.navigate("EditProfile")}>
                Edit Profile
              </Button>
            </Card>
          ))}
          <View style={styles.buttonContainer}>
            <Button onPress={handleRefresh} size="small">
              Refresh
            </Button>
            <Button onPress={handleSignOut} size="small">
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
});

export default ProfileScreen;
