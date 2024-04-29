// ProfileCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const ProfileCard = ({ firstName, lastName, email, pictureUrl, aboutMe }) => {
  return (
    <Card style={styles.card}>
      <Card.Title title="Title" subtitle="Subtitle" />
        <Image source={{ uri: "https://www.devotional-reflections-from-the-bible.com/images/IMG_1342.jpg" }} style={styles.image} />
      <Card.Content>
        <Text style={styles.aboutTitle}>About Me:</Text>
        <Text>about me</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  aboutTitle: {
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default ProfileCard;
