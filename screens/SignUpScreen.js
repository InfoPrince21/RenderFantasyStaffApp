import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabaseClient"; // Ensure this points to your initialized Supabase client

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    try {
      // Supabase sign-up
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("User signed up", data);
      // Pass email to ConfirmSignUpScreen via navigation parameters
      navigation.navigate("ConfirmSignUp", { email: email });
    } catch (error) {
      console.error("Error signing up:", error.message);
      Alert.alert("Sign Up Failed", error.message);
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default SignUpScreen;
