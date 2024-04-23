import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const NextStepScreen = ({ route, navigation }) => {
  const { nextStep, email, userId } = route.params;

  const handleAction = () => {
    switch (nextStep) {
      case "Confirm Email":
        // Navigate to email confirmation screen
        navigation.navigate("ConfirmEmailScreen", { email, userId });
        break;
      case "Setup Profile":
        // Navigate to profile setup screen
        navigation.navigate("SetupProfileScreen", { userId });
        break;
      case "Retry":
        // Go back to the sign up screen
        navigation.navigate("SignUpScreen");
        break;
      default:
        // Default action or error handling
        console.log("Unknown next step");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Next Step!</Text>
      <Text>Please proceed by clicking the button below.</Text>
      <Button title={`Proceed to ${nextStep}`} onPress={handleAction} />
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
    marginBottom: 10,
  },
});

export default NextStepScreen;
