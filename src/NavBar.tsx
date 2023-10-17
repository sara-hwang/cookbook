import React, { useEffect, useState } from "react";
import "./Search.css";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { popTab, setCurrentTab } from "./redux/tabsList";

interface IProps {
  isActive: boolean;
}

export default function NavBar({ isActive }: IProps) {
  const { pathname } = useLocation();
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

  useEffect(() => {
    console.log(pathname);
    if (pathname == "/" || pathname == "/view") {
      dispatch(setCurrentTab(0));
    } else if (pathname == "/add") {
      dispatch(setCurrentTab(1));
    }
  }, [pathname]);

  useEffect(() => {
    if (isActive) {
      dispatch(setCurrentTab(0));
    }
  }, [isActive]);

  return (
    <Box>
      <Tabs
        // className={isActive ? "tabs" : ""}
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
  );
}
