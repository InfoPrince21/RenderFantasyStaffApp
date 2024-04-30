// playersSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AirtableApiKey, AirtableBaseId } from "../../airtableconfig";

// Define the initial state
const initialState = {
  players: [],
  loading: false,
  error: null,
};

// Define the async thunk to fetch players from Airtable
export const fetchPlayers = createAsyncThunk(
  "players/fetchPlayers",
  async () => {
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${AirtableBaseId}/Profiles`,
        {
          headers: {
            Authorization: `Bearer ${AirtableApiKey}`,
          },
        }
      );
      return response.data.records;
    } catch (error) {
      throw error;
    }
  }
);

// Create the players slice
const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default playersSlice.reducer;
