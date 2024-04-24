import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseClient";
import { AirtableApiKey, AirtableBaseId } from "../airtableconfig";

const ProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleAuthStateChange = (event, session) => {
      if (session && session.user) {
        setUserEmail(session.user.email);
        fetchRecords(session.user.email);
      } else {
        setUserEmail("");
        navigation.navigate("Home");
      }
    };

    const authListener = supabase.auth.onAuthStateChange(handleAuthStateChange);
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const fetchRecords = async (email) => {
    setLoading(true);
    try {
      const url = `https://api.airtable.com/v0/${AirtableBaseId}/Profiles`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AirtableApiKey}`,
        },
      });
      const data = await response.json();
      const userRecords = data.records.filter(
        (record) => record.fields.Email === email
      );
      setRecords(userRecords || []);
    } catch (error) {
      console.error("Error fetching records from Airtable:", error);
      Alert.alert("Error", "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Sign Out Failed", error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      Alert.alert("Success", "Password updated successfully.");
      setNewPassword(""); // Clear the password input field
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled) {
      console.log("User cancelled image selection.");
    } else if (result.errorCode) {
      console.error("ImagePicker Error: ", result.errorMessage);
      Alert.alert("Image Picker Error", result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset.uri);
      uploadImageToSupabase(selectedAsset);
    } else {
      console.log("No assets found in result.");
      Alert.alert("Error", "No image found.");
    }
  };
const uploadImageToSupabase = async (asset) => {
  const fileUri = asset.uri;
  if (!fileUri) {
    console.error("No file URI available");
    Alert.alert("Upload Failed", "No file URI available");
    return;
  }

  // Extract the username part of the email, assuming the email is standard with one '@' character
  const emailUsername = userEmail
    .substring(0, userEmail.lastIndexOf("@"))
    .replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = fileUri.split("/").pop();
  const fileExtension = fileName ? fileName.split(".").pop() : "png"; // Default to 'png' if extension is not found
  const mimeType = `image/${fileExtension}`;
  const filePath = `${emailUsername}/${Date.now()}-${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from("FantasyStaffBucket")
      .upload(
        filePath,
        {
          uri: fileUri,
          type: mimeType,
          name: fileName,
        },
        { upsert: true }
      );

    if (error) throw new Error(error.message);

    const imageUrl = supabase.storage
      .from("FantasyStaffBucket")
      .getPublicUrl(filePath).publicURL;
    updateAirtableRecord(userEmail, imageUrl);
    setSelectedImage(imageUrl); // Set the image URL to state
  } catch (error) {
    console.error("Error uploading image: ", error);
    Alert.alert("Upload Error", error.message || "Failed to upload image.");
  }
};

const updateAirtableRecord = async (email, imageUrl) => {
  const recordToUpdate = records.find(
    (record) => record.fields.Email === email
  );
  if (recordToUpdate) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${AirtableBaseId}/Profiles/${recordToUpdate.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${AirtableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Picture: imageUrl,
                },
            },
          ),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.error && responseData.error.message
            ? responseData.error.message
            : "Unknown error from Airtable"
        );
      }
      Alert.alert(
        "Record Updated",
        "Profile picture updated successfully in Airtable."
      );
    } catch (error) {
      console.error("Error updating record in Airtable:", error);
      Alert.alert("Update Error", error.toString()); // Using error.toString() to capture the correct error message
    }
  } else {
    Alert.alert(
      "No Record Found",
      "No matching record found in Airtable for the current user."
    );
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.userInfo}>Email: {userEmail}</Text>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text>Loading...</Text>
        ) : records.length === 0 ? (
          <Text>No records found</Text>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.record}>
              <Text>Email: {record.fields.Email}</Text>
              <Text>Name: {record.fields.Name}</Text>
              <Text>About Me: {record.fields.AboutMe}</Text>
              {record.fields.Picture && (
                <Image
                  source={{ uri: record.fields.Picture[0].url }}
                  style={styles.image}
                />
              )}
            </View>
          ))
        )}
      </ScrollView>
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        placeholder="Enter new password"
        secureTextEntry={true}
      />
      <Button
        title={loading ? "Updating..." : "Update Password"}
        onPress={handleUpdatePassword}
        disabled={loading}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    marginBottom: 20,
  },
  record: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default ProfileScreen;
