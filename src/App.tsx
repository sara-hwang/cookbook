import React, { useEffect, useState } from "react";
import "./App.css";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TabItem } from "./types";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { popTab, setCurrentTab } from "./redux/tabsList";

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

  useEffect(() => {
    navigate(tabsList[currentTab].link);
  }, [currentTab]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {tabsList.map((tab, key) => {
            return (
              <Tab
                key={key}
                label={
                  <span>
                    {tab.label}
                    {tab.link != "/view" && tab.link != "/add" && (
                      <IconButton
                        size="small"
                        component="span"
                        onClick={() => {
                          dispatch(popTab(tab));
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </span>
                }
                component={Link}
                to={tab.link}
              />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
}
