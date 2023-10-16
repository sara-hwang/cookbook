import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Box, Icon, IconButton, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TabItem } from "./types";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { popTab, setCurrentTab } from "./redux/tabsList";
import logo from "./icon.png";

export default function App() {
  const { tabsList, currentTab } = useAppSelector(
    (state: RootState) => state.tabsList
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentTab(newValue));
  };

  useEffect(() => {
    navigate(tabsList[currentTab].link);
  }, [currentTab]);

  return (
    <Box sx={{ width: "100%" }}>
      <img src={logo} className="logo" />
      <Box
        className="paragraph"
        sx={{ borderBottom: 1, borderColor: "lightblue" }}
      >
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
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          dispatch(popTab(tab));
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </span>
                }
              />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
}
