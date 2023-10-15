import React, { useEffect, useState } from "react";
import "./App.css";
import { Box, Tab, Tabs } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TabItem } from "./types";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { setCurrentTab } from "./redux/tabsList";

export default function App() {
  const { tabsList, currentTab } = useAppSelector(
    (state: RootState) => state.tabsList
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentTab(newValue));
    navigate(tabsList[newValue].link);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} onChange={handleChange}>
          {tabsList.map((tab, key) => {
            return (
              <Tab key={key} label={tab.label} component={Link} to={tab.link} />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
}
