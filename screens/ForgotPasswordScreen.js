import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { supabase } from "../supabaseClient";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  async function handleResetPassword() {
    if (!isValidEmail(email)) {
      showSnackbar("Please enter a valid email address");
      return;
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }
      showSnackbar("Password reset email sent successfully");
      navigation.navigate("ResetPassword", { email: email });
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      showSnackbar(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo1.webp")} style={styles.logo} />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        accessibilityLabel="Enter your email address"
      />
      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
        accessibilityLabel="Reset your password"
      >
        Reset Password
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
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
    width: 300,
    height: 300,
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
