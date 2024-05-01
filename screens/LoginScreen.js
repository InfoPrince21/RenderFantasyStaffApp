import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Input, Button } from "@ui-kitten/components"; // Import UI Kitten components
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
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button onPress={signInWithEmail} style={styles.button}>
        Sign In
      </Button>
      <Button
        appearance="ghost"
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.textButton}
      >
        Forgot Password?
      </Button>
      <Button
        appearance="ghost"
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
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: "contain",
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
