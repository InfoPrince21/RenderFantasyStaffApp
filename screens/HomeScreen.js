import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Layout, Text, Toggle, Card, useTheme } from "@ui-kitten/components";
import { ThemeContext } from "../theme-context";

const HomeScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const uiTheme = useTheme();

  // Determine background color and text color based on the current theme
  const cardBackgroundColor =
    theme === "dark"
      ? uiTheme["background-basic-color-2"]
      : uiTheme["background-basic-color-1"];

  const cardTextColor =
    theme === "dark" ? uiTheme["text-basic-color"] : uiTheme["color-basic-900"]; // Use a darker color for text on light background

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: uiTheme["background-basic-color-1"] },
      ]}
    >
      <Text category="h1" style={styles.title}>
        Welcome to the App
      </Text>
      <Toggle
        style={styles.toggle}
        checked={theme === "dark"} // Reflect the current theme state
        onChange={toggleTheme}
        status={theme === "dark" ? "success" : "info"}
      >
        {theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
      </Toggle>
      <View style={styles.cardContainer}>
        <Card
          style={[styles.card, { backgroundColor: cardBackgroundColor }]}
          status={theme === "dark" ? "basic" : "primary"}
        >
          <Text
            category="s1"
            style={[styles.cardText, { color: cardTextColor }]}
          >
            This is a UI Kitten Card
          </Text>
        </Card>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  toggle: {
    marginVertical: 16,
  },
  cardContainer: {
    marginTop: 20,
  },
  card: {
    width: 300,
    padding: 16,
  },
  cardText: {
    textAlign: "center",
  },
});

export default HomeScreen;
