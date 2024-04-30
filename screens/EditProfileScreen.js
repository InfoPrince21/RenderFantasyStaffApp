import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Button, Card, Input, Layout, Text, Icon } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseClient";
import { AirtableApiKey, AirtableBaseId } from "../airtableconfig";

const EditProfileScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);

  useEffect(() => {
    const { data: authListener, error } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          setUserEmail(session.user.email);
          fetchRecords(session.user.email);
        } else {
          setUserEmail("");
          navigation.navigate("Home");
        }
      }
    );

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();

    // return () => authListener.unsubscribe();
  }, []);

  const fetchRecords = async (email) => {
    setLoading(true);
    try {
      const url = `https://api.airtable.com/v0/${AirtableBaseId}/Profiles?filterByFormula=Email="${email}"`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${AirtableApiKey}` },
      });
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error("Error fetching records from Airtable:", error);
      Alert.alert("Error", "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

const updateAirTablePicture = async (email, imageUrl) => {
  setLoading(true);
  try {
    const recordToUpdate = records.find(
      (record) => record.fields.Email === email
    );
    if (!recordToUpdate) {
      Alert.alert(
        "No Record Found",
        "No matching record found in Airtable for the current user."
      );
      return;
    }

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
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error && errorData.error.message
          ? errorData.error.message
          : "Unknown error from Airtable"
      );
    }

    Alert.alert("Success", "Picture updated successfully in Airtable.");
    const updatedRecords = records.map((record) =>
      record.id === recordToUpdate.id
        ? {
            ...record,
            fields: { ...record.fields, Picture: [{ url: imageUrl }] },
          }
        : record
    );
    setRecords(updatedRecords);
  } catch (error) {
    console.error("Error updating picture in Airtable:", error);
    Alert.alert("Update Error", error.message || "Failed to update picture.");
  } finally {
    setLoading(false);
  }
};

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result);
            setIsSaveButtonVisible(true);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
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
        setIsSaveButtonVisible(true);
      } else {
        console.log("No assets found in result.");
        Alert.alert("Error", "No image found.");
      }
    }
  };

  const savePhoto = async () => {
    if (!selectedImage) {
      Alert.alert("No selected image", "Please select an image first.");
      return;
    }

    setLoading(true);
    try {
      const emailUsername = userEmail
        .substring(0, userEmail.lastIndexOf("@"))
        .replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `profile_photo_${Date.now()}`; // Added a timestamp to ensure unique file names
      const fileExtension = "jpg"; // Assuming JPEG as the default format for images from image picker
      const mimeType = `image/${fileExtension}`;
      const filePath = `${emailUsername}/${fileName}.${fileExtension}`;

      if (Platform.OS === "web") {
        // For web version, convert selectedImage to a Blob object
        const blob = await fetch(selectedImage).then((response) =>
          response.blob()
        );

        // Upload the Blob object to Supabase Storage
        const uploadResponse = await supabase.storage
          .from("FantasyStaffBucket")
          .upload(filePath, blob, { upsert: true });

        if (uploadResponse.error) {
          throw new Error(uploadResponse.error.message);
        }
      } else {
        // For non-web platforms, use the original method
        const uploadResponse = await supabase.storage
          .from("FantasyStaffBucket")
          .upload(
            filePath,
            {
              uri: selectedImage,
              type: mimeType,
              name: `${fileName}.${fileExtension}`,
            },
            { upsert: true }
          );

        if (uploadResponse.error) {
          throw new Error(uploadResponse.error.message);
        }
      }

      const { publicURL, error: urlError } = supabase.storage
        .from("FantasyStaffBucket")
        .getPublicUrl(filePath);

      if (urlError) {
        throw new Error(urlError.message);
      }

      // Construct URL either from publicURL or build it manually if not available
      const constructedUrl =
        publicURL ||
        `https://mquxomutiwqvihuvdsgd.supabase.co/storage/v1/object/public/FantasyStaffBucket/${filePath}`;

      setUploadedFilePath(constructedUrl);
      Alert.alert("Upload Successful", "Your photo was uploaded successfully.");
      console.log("Public URL:", constructedUrl); // Logging the URL for debugging purposes
      setSelectedImage(null);
      setIsSaveButtonVisible(false);
      updateAirTablePicture(userEmail, constructedUrl);
    } catch (error) {
      console.error("Upload Error:", error.message);
      Alert.alert("Upload Error", error.message || "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };



  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      Alert.alert("Success", "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error.message);
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAboutMe = async () => {
    if (!aboutMe.trim()) {
      Alert.alert("Error", "About Me section cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const recordToUpdate = records.find(
        (record) => record.fields.Email === userEmail
      );
      if (!recordToUpdate) {
        Alert.alert(
          "No Record Found",
          "No matching record found in Airtable for the current user."
        );
        return;
      }

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
              AboutMe: aboutMe.trim(),
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error && errorData.error.message
            ? errorData.error.message
            : "Unknown error from Airtable"
        );
      }

      Alert.alert("Success", "About Me section updated successfully.");

      // Optionally update local records to reflect the change
      const updatedRecords = records.map((record) =>
        record.id === recordToUpdate.id
          ? { ...record, fields: { ...record.fields, AboutMe: aboutMe } }
          : record
      );
      setRecords(updatedRecords);
    } catch (error) {
      console.error("Error updating About Me in Airtable:", error);
      Alert.alert(
        "Update Error",
        error.message || "Failed to update About Me."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          records.map((record) => (
            <Card style={styles.record} key={record.id}>
              <Button
                appearance="ghost"
                onPress={() => navigation.navigate("MyProfile")}
                style={styles.backButton}
              >
                Back to Profile
              </Button>
              <Text category="h6">
                Name: {record.fields.FirstName} {record.fields.LastName}
              </Text>
              <Text>Email: {record.fields.Email}</Text>
              <Text>About Me: {record.fields.AboutMe}</Text>
              <Input
                value={newPassword}
                label="New Password"
                placeholder="Enter new password"
                accessoryRight={(props) => (
                  <Icon {...props} name="lock-outline" />
                )}
                secureTextEntry={true}
                onChangeText={setNewPassword}
              />
              <Input
                value={confirmPassword}
                label="Confirm Password"
                placeholder="Confirm new password"
                accessoryRight={(props) => (
                  <Icon {...props} name="lock-outline" />
                )}
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
              />
              <Button onPress={handleUpdatePassword}>Update Password</Button>
              <Input
                value={aboutMe}
                label="About Me"
                placeholder="Edit About Me"
                accessoryRight={(props) => (
                  <Icon {...props} name="person-outline" />
                )}
                onChangeText={setAboutMe}
              />
              <Button onPress={handleUpdateAboutMe}>Update About Me</Button>
            </Card>
          ))
        )}
        <Card>
          <Button onPress={pickImage}>Change Photo</Button>
          {isSaveButtonVisible && (
            <Button onPress={savePhoto}>Save Photo</Button>
          )}
        </Card>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  record: {
    marginBottom: 15,
  },
});

export default EditProfileScreen;