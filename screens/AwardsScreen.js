import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AwardsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the AwardsScreen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // You can change the background color
  },
  text: {
    fontSize: 20,
    color: "#333", // Adjust text color
  },
});

export default AwardsScreen;
