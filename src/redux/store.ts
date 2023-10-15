import { configureStore } from "@reduxjs/toolkit";
import recipeDraftReducer from "./recipeDraft";
import tabsListReducer from "./tabsList";
import { persistReducer, persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    recipeDraft: recipeDraftReducer,
    tabsList: tabsListReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
