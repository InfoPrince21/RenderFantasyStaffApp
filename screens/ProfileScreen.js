import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabaseClient";

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuthStateChange = (event, session) => {
      if (session && session.user) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail("");
        navigation.navigate("Home");
      }
    };

    const authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);
    fetchUserInfo();

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const fetchUserInfo = async () => {
    const session = supabase.auth.session();
    if (session && session.user) {
      setUserEmail(session.user.email);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Sign Out Failed", error.message);
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
