import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient"; // Ensure you have the correct path

// Define the async thunk for fetching the authenticated user
export const fetchAuthUser = createAsyncThunk(
  "user/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = supabase.auth.user();

      if (!user) {
        throw new Error("No authenticated user found.");
      }

      // Optionally fetch more detailed user info from your database if needed
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the user slice with initial state, reducers, and extra reducers
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducer to update a user's details
    updateUser(state, action) {
      if (state.currentUser && state.currentUser.id === action.payload.id) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    // Reducer to clear the current user upon logout
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Export the actions
export const { updateUser, clearCurrentUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
