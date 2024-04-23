import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Example synchronous reducer to add a user to the team
    addUserToTeam(state, action) {
      // Assuming action.payload contains the user object to be added
      state.users.push(action.payload);
    },
    // Example synchronous reducer to remove a user from the team
    removeUserFromTeam(state, action) {
      // Assuming action.payload is the user id to be removed
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

console.log("Slice creation:", teamSlice);

export const { addUserToTeam, removeUserFromTeam } = teamSlice.actions;
export default teamSlice.reducer;
