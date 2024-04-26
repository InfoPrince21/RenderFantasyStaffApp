import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
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

    // Generate a random user_id
    const userId = Math.floor(Math.random() * 1000000);

    try {
      const { user, error } = await supabase.auth.verifyOtp({
        token: code,
        email: email,
        type: "email",
      });

      if (error) {
        throw error;
      }

      if (!error) {
        const { data, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              user_id: userId,
              email: email,
              first_name: firstName,
              last_name: lastName,
            },
          ]); // Use the random userId here

        if (insertError) {
          throw insertError;
        }

        Alert.alert(
          "Success",
          "Email verified! User information added to the database. You are now logged in."
        );
        // Uncomment and modify the navigation line below as needed
        // navigation.navigate("HomeScreen");
      } else {
        Alert.alert(
          "Verification Pending",
          "Please verify your email to complete registration."
        );
      }
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

  const goToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Verify Email" onPress={confirmSignUp} />
      <Button
        title="Resend Code"
        onPress={resendConfirmationCode}
        color="#20B2AA"
      />
      <Button title="Go to Login" onPress={goToLogin} color="#1E90FF" />
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
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: "80%",
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default ConfirmEmailScreen;
