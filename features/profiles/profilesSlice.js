import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AirtableApiKey, AirtableBaseId } from "../airtableconfig";

// Define the initial state
const initialState = {
  profiles: [],
  loading: false,
  error: null,
};

// Define the async thunk to fetch profiles from Airtable
export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async () => {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${AirtableBaseId}/Profiles?maxRecords=100&view=Grid%20view`,
        {
          headers: {
            Authorization: `Bearer ${AirtableApiKey}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }
      const data = await response.json();
      return data.records;
    } catch (error) {
      throw error;
    }
  }
);

// Create the profiles slice
const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk
export { fetchProfiles };

// Export the reducer
export default profilesSlice.reducer;
