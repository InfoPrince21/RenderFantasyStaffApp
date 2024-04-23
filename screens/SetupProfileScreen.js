import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const SetupProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");

  const updateProfile = async () => {
    try {
      // Removed AWS Amplify Auth.updateUserAttributes code

      Alert.alert("Success", "Profile updated successfully.");
      navigation.navigate("Home"); // Navigate to home or another appropriate screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Update Profile" onPress={updateProfile} />
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
  input: {
    width: "90%",
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default SetupProfileScreen;
