import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RedeemPointsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the RedeemPointsScreen!</Text>
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

export default RedeemPointsScreen;
