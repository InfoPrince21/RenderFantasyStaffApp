import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlayers } from "../features/players/playersSlice";
import { Card, Avatar } from "@ui-kitten/components";

const PlayersScreen = () => {
  const dispatch = useDispatch();
  const { players, loading, error } = useSelector((state) => state.players);

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

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
