import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TeamScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Teams Page!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8", // You can change the background color
  },
  text: {
    fontSize: 20,
    color: "#1a1a1a", // Adjust text color
  },
});

export default TeamScreen;
