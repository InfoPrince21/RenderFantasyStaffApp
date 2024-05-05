import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar } from "@ui-kitten/components";
import { fetchPlayers } from "../features/players/playersSlice";

const PlayersScreen = () => {
  const dispatch = useDispatch();
  const players = useSelector((state) => state.players.players);
  const loading = useSelector((state) => state.players.loading);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

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
    <View style={styles.container}>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      <Button title="Refresh" onPress={() => dispatch(fetchPlayers())} />
    </View>
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
