import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Input, Text, Layout } from "@ui-kitten/components";
import { supabase } from "../supabaseClient";

const ConfirmEmailScreen = ({ route, navigation }) => {
  const { email, firstName, lastName } = route.params;
  const [code, setCode] = useState("");

  const confirmSignUp = async () => {
    if (!code.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter the verification code sent to your email."
      );
      return;
    }

    try {
      const { user, error } = await supabase.auth.verifyOtp({
        token: code,
        email: email,
        type: "email",
      });

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Email verified! You are now logged in.");
      navigation.navigate("HomeScreen"); // Or any appropriate screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const resendConfirmationCode = async () => {
    try {
      const { error } = await supabase.auth.api.sendEmailChangeToken(email);
      if (error) {
        throw error;
      }
      Alert.alert(
        "Success",
        "Verification code sent again. Please check your email."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Layout style={styles.container}>
      <Text category="h1" style={styles.title}>
        Confirm Your Email
      </Text>
      <Input
        style={styles.input}
        placeholder="Enter your verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button style={styles.button} onPress={confirmSignUp}>
        Verify Email
      </Button>
      <Button
        style={styles.button}
        onPress={resendConfirmationCode}
        appearance="outline"
      >
        Resend Code
      </Button>
      <Button
        style={styles.button}
        onPress={() => navigation.navigate("LoginScreen")}
        appearance="ghost"
      >
        Go to Login
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff", // Background color of the screen
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: "80%",
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    width: "80%",
  },
});

export default ConfirmEmailScreen;
