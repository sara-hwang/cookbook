import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TabItem } from "../utils/types";
import { defaultTabs } from "../App";

const initialState: { tabsList: TabItem[]; currentTab: number } = {
  tabsList: [],
  currentTab: -(defaultTabs.length + 1),
};

const findIndex = (tabs: TabItem[], tabLink: string) => {
  return tabs.map((tab) => tab.link).indexOf(tabLink);
};

export const tabsListSlice = createSlice({
  name: "tabsList",
  initialState,
  reducers: {
    popTab: (state, action: PayloadAction<string>) => {
      const index = findIndex(state.tabsList, action.payload);
      if (index > -1) {
        if (index <= state.currentTab) {
          state.currentTab =
            state.currentTab == 0 ? -defaultTabs.length : state.currentTab - 1;
        }
        state.tabsList = [
          ...state.tabsList.slice(0, index),
          ...state.tabsList.slice(index + 1),
        ];
      }
    },
    pushTab: (state, action: PayloadAction<TabItem>) => {
      const index = findIndex(state.tabsList, action.payload.link);
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
