import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Input, Button } from "@ui-kitten/components";
import { supabase } from "../supabaseClient";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state

  async function signInWithEmail() {
    setIsLoading(true); // Start loading
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("User signed in successfully:", data);
      navigation.navigate("Home"); // Navigate to Home after success
    } catch (error) {
      Alert.alert("Sign In Failed", error.message);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo1.webp")} style={styles.logo} />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        accessibilityLabel="Enter your email"
      />
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        accessibilityLabel="Enter your password"
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button onPress={signInWithEmail} style={styles.button}>
          Sign In
        </Button>
      )}
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
