// src/features/users/fetchUsers.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient"; // Adjust the path as necessary

const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default fetchUsers;
