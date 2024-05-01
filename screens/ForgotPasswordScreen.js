import React, { useState } from "react";
import { Layout, Input, Button, Text } from "@ui-kitten/components";
import { Image, StyleSheet } from "react-native";
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
    <Layout style={styles.container}>
      <Image source={require("../assets/logo1.webp")} style={styles.logo} />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCompleteType="email"
        accessibilityLabel="Enter your email address"
      />

      <Button
        onPress={handleResetPassword}
        style={styles.button}
        accessibilityLabel="Reset your password"
      >
        Reset Password
      </Button>

      {snackbarVisible && (
        <Text category="label" status="danger">
          {snackbarMessage}
        </Text>
      )}
    </Layout>
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
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
