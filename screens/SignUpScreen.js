import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios"; // Import Axios for HTTP requests
import { supabase } from "../supabaseClient";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const AIRTABLE_BASE_ID = "appmqv083cLppisF5"; // Replace with your Airtable Base ID
  const AIRTABLE_API_KEY =
    "patgWojlv2ALaAC1H.7ee8c2073f2f3d8bf25a54fd1223394370fc3eb62ac0d0c023d458f2faa4c5ec"; // Replace with your Airtable API Key
  const AIRTABLE_TABLE_NAME = "Profiles"; // The name of the table where data will be stored

  async function handleSignUp() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Supabase sign-up
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      // If sign-up is successful, post data to Airtable
      await postEmailToAirtable(email);

      console.log("User signed up", user);
      navigation.navigate("ConfirmSignUp", {
        email: email,
        firstName,
        lastName,
      });
    } catch (error) {
      console.error("Error signing up:", error.message);
      Alert.alert("Sign Up Failed", error.message);
    }
  }

  async function postEmailToAirtable(email) {
    try {
      const response = await axios.post(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
        {
          fields: {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Picture:
              "https://chatai.com/wp-content/uploads/2023/11/tr71123-ai-art.jpeg",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Email posted to Airtable:", response.data);
    } catch (error) {
      console.error(
        "Error posting email to Airtable:",
        error.response || error.message
      );
      Alert.alert(
        "Airtable Update Failed",
        error.message || "Failed to update Airtable."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo1.webp")} style={styles.logo} />
      <TextInput
        label="First Name"
        mode="outlined"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        mode="outlined"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
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
      <TextInput
        label="Confirm Password"
        mode="outlined"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
    width: 300,
    height: 300,
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
