import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../supabaseClient";

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
      <Image
        source={require("../assets/logo1.webp")} // Adjust path as necessary
        style={styles.logo}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300, // Adjust width as needed
    height: 300, // Adjust height as needed
    marginBottom: 20,
    resizeMode: "contain",
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

export default SignUpScreen;
