import { supabase } from "../supabaseClient";

export const uploadImageToSupabase = async (userEmail, fileUri) => {
  const emailUsername = userEmail
    .substring(0, userEmail.lastIndexOf("@"))
    .replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = fileUri.split("/").pop();
  const fileExtension = fileName ? fileName.split(".").pop() : "png";
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

    return supabase.storage.from("FantasyStaffBucket").getPublicUrl(filePath)
      .publicURL;
  } catch (error) {
    console.error("Error uploading image to Supabase: ", error);
    throw error;
  }
};
