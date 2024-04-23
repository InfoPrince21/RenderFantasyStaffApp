import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from "../supabaseClient";

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
      // Optionally navigate to another screen here
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
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button mode="contained" onPress={signInWithEmail} style={styles.button}>
        Sign In
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.textButton}
      >
        Forgot Password?
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("SignUp")}
        style={styles.textButton}
      >
        No account? Sign Up
      </Button>
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
  logo: {
    width: 150, // Adjust the size according to your design needs
    height: 150, // Ensure the aspect ratio remains consistent
    marginBottom: 20,
  },
  input: {
    width: "90%",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: "90%",
  },
  textButton: {
    marginTop: 5,
    width: "90%",
  },
});

export default LoginScreen;
