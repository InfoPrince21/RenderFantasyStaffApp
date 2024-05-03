import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { Card, Avatar } from "@ui-kitten/components";

const PlayersScreen = () => {
  const { players } = useSelector((state) => state.players);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Avatar source={{ uri: item.fields.Picture }} style={styles.image} />
      <Text>
        {item.fields.FirstName} {item.fields.LastName}
      </Text>
      <Text>Email: {item.fields.Email}</Text>
      <Text>About Me: {item.fields.AboutMe}</Text>
    </Card>
  );

  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
  },
  image: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
});

export default PlayersScreen;
