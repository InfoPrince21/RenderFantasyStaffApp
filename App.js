import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your new app!</Text>
      <Text style={styles.info}>Running on: {Platform.OS.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "gray",
  },
});
