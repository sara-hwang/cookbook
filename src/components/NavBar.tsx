import React, { useEffect, useState } from "react";
import "../stylesheets/App.css";
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { popTab, setCurrentTab } from "../redux/tabsList";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar() {
  const { pathname } = useLocation();
  const [navBarVisible, setNavBarVisible] = useState(window.innerWidth > 400);
  const { tabsList, currentTab } = useAppSelector(
    (state: RootState) => state.tabsList
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentTab(newValue));
  };

  useEffect(() => {
    if (pathname !== tabsList[currentTab].link) {
      navigate(tabsList[currentTab].link);
    }
  }, [currentTab]);

  useEffect(() => {
    if (pathname == "/" || pathname == "/view") {
      dispatch(setCurrentTab(0));
    } else if (pathname == "/add") {
      dispatch(setCurrentTab(1));
    }
  }, [pathname]);

  const toggleVisibility = () => {
    setNavBarVisible(!navBarVisible);
  };

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {navBarVisible && (
          <img
            src="/logo.png"
            width="150"
            height="25"
            style={{ marginTop: "6px" }}
          />
        )}
        <IconButton disableRipple onClick={toggleVisibility}>
          <MenuIcon />
        </IconButton>
      </div>
      {navBarVisible && (
        <div className="nav-tabs">
          <Tabs
            value={currentTab}
            onChange={handleChange}
            variant="scrollable"
            orientation="vertical"
          >
            {tabsList.map((tab, key) => {
              return (
                <Tab
                  disableRipple
                  key={key}
                  label={
                    <div className="side-by-side-container">
                      <span className="nav-tab-label">{tab.label}</span>
                      {tab.link != "/view" && tab.link != "/add" && (
                        <div className="nav-tab-close-button">
                          <IconButton
                            size="small"
                            component="span"
                            disableRipple
                            sx={{
                              "&:hover": { color: "red" },
                            }}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              dispatch(popTab(tab));
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  }
                />
              );
            })}
          </Tabs>
        </div>
      )}
    </Box>
  );
}
