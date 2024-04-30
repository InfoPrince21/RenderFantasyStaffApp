import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient"; // Ensure you have the correct path

// Define the async thunk for fetching all authenticated users
export const fetchAllAuthUsers = createAsyncThunk(
  "users/fetchAllAuthUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data: users, error } = await supabase.from("users").select("*");

      if (error) {
        throw new Error(error.message);
      }

      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the users slice with initial state, reducers, and extra reducers
const usersSlice = createSlice({
  name: "users",
  initialState: {
    userList: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducer to update a user's details
    updateUser(state, action) {
      const { id } = action.payload;
      const index = state.userList.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.userList[index] = { ...state.userList[index], ...action.payload };
      }
    },
    // Reducer to clear the user list upon logout
    clearUserList(state) {
      state.userList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAuthUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAuthUsers.fulfilled, (state, action) => {
        state.userList = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllAuthUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Export the actions
export const { updateUser, clearUserList } = usersSlice.actions;

// Export the reducer
export default usersSlice.reducer;
