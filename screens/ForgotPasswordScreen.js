import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../supabaseClient";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Changed state variable name to email

  async function handleResetPassword() {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }
      console.log("Password reset email sent successfully:", data);
      // Optionally, navigate to another screen
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  }


  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo1.webp")} style={styles.logo} />
      <TextInput
        label="Email" // Change label to "Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

export default ForgotPasswordScreen;
