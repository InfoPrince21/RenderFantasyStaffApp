import { AirtableApiKey, AirtableBaseId } from "../airtableconfig";

export const fetchRecords = async (email) => {
  const url = `https://api.airtable.com/v0/${AirtableBaseId}/Profiles`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AirtableApiKey}`,
    },
  });
  const data = await response.json();
  return data.records.filter((record) => record.fields.Email === email);
};

export const updateAirtableRecord = async (recordId, imageUrl) => {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AirtableBaseId}/Profiles/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AirtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Picture: [{ url: imageUrl }],
          },
        }),
      }
    );
    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.error.message);
    return responseData;
  } catch (error) {
    console.error("Error updating Airtable record: ", error);
    throw error;
  }
};
