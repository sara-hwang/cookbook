import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Recipe, TabItem } from "../types";
import type { RootState } from "./store";

const initialState: { tabsList: TabItem[]; currentTab: number } = {
  tabsList: [
    { label: "View Recipes", link: "/view" },
    { label: "Add Recipe", link: "/add" },
  ],
  currentTab:
    window.location.pathname == "/view" || window.location.pathname == "/"
      ? 0
      : 1,
};

const findIndex = (tabs: TabItem[], newTab: TabItem) => {
  return tabs.map((tab) => tab.label).indexOf(newTab.label);
};

export const tabsListSlice = createSlice({
  name: "tabsList",
  initialState,
  reducers: {
    popTab: (state, action: PayloadAction<TabItem>) => {
      const index = findIndex(state.tabsList, action.payload);
      if (index > -1) {
        state.currentTab = index - 1;
        state.tabsList.splice(index, 1);
      }
    },
    pushTab: (state, action: PayloadAction<TabItem>) => {
      const index = findIndex(state.tabsList, action.payload);
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
export const { popTab, pushTab, setCurrentTab } = tabsListSlice.actions;
