import React, { useEffect } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar } from "@ui-kitten/components";
import { fetchTeams } from "../features/teams/teamsSlice";

const TeamsScreen = () => {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Avatar source={{ uri: item.fields.Logo }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fields.Name}</Text>
        <Text style={styles.info}>Captain: {item.fields.Captain}</Text>
        <Text style={styles.info}>Team ID: {item.fields.TeamId}</Text>
      </View>
    </Card>
  );
  const handleRefresh = () => {
    dispatch(fetchTeams());
  };

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      <Button title="Refresh" onPress={handleRefresh} />
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 16,
    flexDirection: "row",
  },
  avatar: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    marginTop: 4,
  },
});

export default TeamsScreen;
