import { Action, Middleware, configureStore } from "@reduxjs/toolkit";
import recipeDraftReducer from "./recipeDraft";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    recipeDraft: recipeDraftReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
