import React from "react";
import {
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { Card, Avatar } from "@ui-kitten/components";

const TeamsScreen = () => {
  const { teams } = useSelector((state) => state.teams);
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Avatar source={{ uri: item.fields.Logo }} style={styles.avatar} />
      <Text style={styles.name}>{item.fields.Name}</Text>
      <Text style={styles.name}>{item.fields.Camptain}</Text>
      <Text style={styles.name}>{item.fields.TeamId}</Text>
    </Card>
  );

  return (
    <FlatList
      data={teams}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
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
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    alignSelf: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
});

export default TeamsScreen;
