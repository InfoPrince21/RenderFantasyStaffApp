import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice";
import teamReducer from "../features/teams/teamSlice";

// Configure the Redux store directly with reducers
export const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


