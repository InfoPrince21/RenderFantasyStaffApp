import { configureStore } from "@reduxjs/toolkit";
import playersReducer from "../features/players/playersSlice";
import teamsReducer from "../features/teams/teamsSlice";

// Configure the Redux store directly with reducers
export const store = configureStore({
  reducer: {
    players: playersReducer,
    teams: teamsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
