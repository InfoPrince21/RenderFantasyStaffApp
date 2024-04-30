// teamsSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AirtableApiKey, AirtableBaseId } from "../../airtableconfig";

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${AirtableBaseId}/Teams`,
        {
          headers: {
            Authorization: `Bearer ${AirtableApiKey}`,
          },
        }
      );
      return response.data.records;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamsSlice.reducer;
