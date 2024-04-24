import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { supabase } from "../supabaseClient";

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  async function handleTokenVerification() {
    if (!token || !email) {
      showSnackbar("Please enter the token and email provided.");
      return;
    }

    try {
      const { user, error } = await supabase.auth.verifyOtp({
        token: token,
        email: email,
        type: "email",
      });

      if (error) {
        throw error;
      }

      showSnackbar(
        "Email verified successfully. Please proceed to set your new password."
      );
    } catch (error) {
      console.error("Error verifying email token:", error);
      showSnackbar(error.message || "Failed to verify email token.");
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
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Token"
        mode="outlined"
        value={token}
        onChangeText={setToken}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button
        mode="contained"
        onPress={handleTokenVerification}
        style={styles.button}
      >
        Verify Email
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

export default ResetPasswordScreen;
