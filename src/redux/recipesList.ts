import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../utils/types";

const initialState: { recipesList: Recipe[] } = {
  recipesList: [],
};

export const recipesListSlice = createSlice({
  name: "recipesList",
  initialState,
  reducers: {
    setRecipesList: (state, action: PayloadAction<Recipe[]>) => {
      state.recipesList = action.payload;
    },
  },
});

export default recipesListSlice.reducer;
export const { setRecipesList } = recipesListSlice.actions;
