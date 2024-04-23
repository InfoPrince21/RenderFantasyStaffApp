import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../supabaseClient";

const ResetPasswordScreen = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState("");

  async function handleResetPassword() {
    const { email } = route.params; // Extract email from route params
    try {
      // Call Supabase method to update password
      const { data, error } = await supabase.auth.updateUser({
        email: email, // Use the email extracted from route params
        password: newPassword,
      });
      if (error) {
        throw error;
      }
      console.log("Password reset successfully:", data);
      // Optionally navigate to another screen
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo1.webp")} style={styles.logo} />
      <TextInput
        label="New Password"
        mode="outlined"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
      >
        Reset Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 300, // Adjust width as needed
    height: 300, // Adjust height as needed
    marginBottom: 20,
    resizeMode: "contain",
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: "100%",
  },
});

export default ResetPasswordScreen;
