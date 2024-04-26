import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async ({ getState }) => {
    const state = getState();
    const { AirtableApiKey, AirtableBaseId } = state.config;
    const response = await fetch(
      `https://api.airtable.com/v0/${AirtableBaseId}/Profiles`,
      {
        headers: { Authorization: `Bearer ${AirtableApiKey}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to fetch");
    return data.records;
  }
);

const profilesSlice = createSlice({
  name: "profiles",
  initialState: {
    data: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchProfiles.pending]: (state) => {
      state.status = "loading";
    },
    [fetchProfiles.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [fetchProfiles.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default profilesSlice.reducer;
