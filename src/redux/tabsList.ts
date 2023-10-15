import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Recipe, TabItem } from "../types";
import type { RootState } from "./store";

const initialState: { tabsList: TabItem[]; currentTab: number } = {
  tabsList: [
    { label: "View Recipes", link: "/view" },
    { label: "Add Recipe", link: "/add" },
  ],
  currentTab: 0,
};

export const tabsListSlice = createSlice({
  name: "tabsList",
  initialState,
  reducers: {
    pushTab: (state, action: PayloadAction<TabItem>) => {
      const findIndex = (newTab: TabItem) => {
        return state.tabsList
          .map((tab) => tab.label)
          .indexOf(action.payload.label);
      };
      const index = findIndex(action.payload);
      if (index == -1) {
        state.tabsList = [...state.tabsList, action.payload];
        state.currentTab = state.tabsList.length - 1;
      } else {
        state.currentTab = index;
      }
    },
    setCurrentTab: (state, action: PayloadAction<number>) => {
      state.currentTab = action.payload;
    },
  },
});

export default tabsListSlice.reducer;
export const { pushTab, setCurrentTab } = tabsListSlice.actions;
