import * as ImagePicker from "expo-image-picker";

export const requestMediaLibraryPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access camera roll is required!");
    return false;
  }
  return true;
};
