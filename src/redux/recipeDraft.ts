import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../types";
import type { RootState } from "./store";

const initialState: Recipe = {
  title: "",
  ingredients: [],
  steps: [],
  servings: 1,
  photo: undefined,
  tags: [],
};

export const recipeDraftSlice = createSlice({
  name: "recipeDraft",
  initialState,
  reducers: {
    setRecipeDraft: (state, action: PayloadAction<Recipe>) => {
      state.title = action.payload.title;
      state.ingredients = action.payload.ingredients;
      state.steps = action.payload.steps;
      state.servings = action.payload.servings;
      state.photo = action.payload.photo;
      state.tags = action.payload.tags;
    },
  },
});

export default recipeDraftSlice.reducer;
export const { setRecipeDraft } = recipeDraftSlice.actions;
