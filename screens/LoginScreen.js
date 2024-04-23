import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabaseClient"; // Ensure this points to your initialized Supabase client

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      Alert.alert("Sign In Failed", error.message);
      return;
    }

    if (data) {
      console.log("User signed in successfully:", data);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={signInWithEmail} />
      <Button
        title="Forgot Password?"
        onPress={() => navigation.navigate("ForgotPassword")}
        color="#1E90FF" // Custom color for the button (optional)
      />
      <Button
        title="No account? Sign Up"
        onPress={() => navigation.navigate("SignUp")}
        color="#20B2AA" // Custom color for the button (optional)
      />
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
    width: "80%",
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default LoginScreen;
