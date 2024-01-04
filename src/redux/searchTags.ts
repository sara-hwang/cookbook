import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  searchTags: string[];
  searchTitle: string;
  searchKey: number;
} = {
  searchTags: [],
  searchTitle: "",
  searchKey: 1,
};

export const searchTagsSlice = createSlice({
  name: "searchTags",
  initialState,
  reducers: {
    setSearchTags: (state, action: PayloadAction<string[]>) => {
      state.searchTitle = "";
      state.searchTags = action.payload;
      if (!action.payload.length) state.searchKey *= -1;
    },
    setSearchTitle: (state, action: PayloadAction<string>) => {
      state.searchTitle = action.payload;
    },
  },
});

export default searchTagsSlice.reducer;
export const { setSearchTags, setSearchTitle } = searchTagsSlice.actions;
