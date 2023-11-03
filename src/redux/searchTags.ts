import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: { searchTags: string[] } = {
  searchTags: [],
};

export const searchTagsSlice = createSlice({
  name: "searchTags",
  initialState,
  reducers: {
    setSearchTags: (state, action: PayloadAction<string[]>) => {
      state.searchTags = action.payload;
    },
  },
});

export default searchTagsSlice.reducer;
export const { setSearchTags } = searchTagsSlice.actions;
