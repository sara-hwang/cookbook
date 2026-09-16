import React, { useEffect, useState } from "react";
import "./stylesheets/App.css";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Close, GitHub } from "@mui/icons-material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

import ViewRecipes from "./components/recipes/view/all/ViewRecipes";
import AddRecipe from "./components/recipes/add/AddRecipe";
import RecipeDetails from "./components/recipes/view/details/RecipeDetails";
import LoginDialog from "./pages/Login";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";
import GroceryList from "./components/grocery/GroceryList";
import { popTab, setCurrentTab } from "./redux/tabsList";
import { RootState } from "./redux/store";
import MealLog from "./components/log/MealLog";
import theme from "./utils/theme";
import HomeNotLoggedIn from "./pages/HomeNotLoggedIn";
import TopNav, { defaultTabs } from "./components/TopNav";
import { TabItem } from "./utils/types";

const drawerWidth = 240;

export default function App() {
  const lsMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery("(max-width:480px)");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { tabsList, currentTab } = useAppSelector(
    (state: RootState) => state.tabsList
  );
  const { searchTags, searchKey, searchTitle } = useAppSelector(
    (state: RootState) => state.searchTags
  );

  const topBarHeight = isMobile ? "100px" : "70px";

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    dispatch(setCurrentTab(index));
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!searchOpen) {
      setSearchOpen(true);
    }
  }, [searchTags]);

  useEffect(() => {
    if (currentTab === -(defaultTabs.length + 1)) navigate(pathname);
    else if (
      currentTab < 0 &&
      pathname !== defaultTabs[currentTab + defaultTabs.length].link
    ) {
      navigate(defaultTabs[currentTab + defaultTabs.length].link);
    } else if (currentTab >= 0 && pathname !== tabsList[currentTab].link) {
      navigate(tabsList[currentTab].link);
    }
  }, [currentTab]);

  useEffect(() => {
    if (pathname == "/") {
      dispatch(setCurrentTab(-(defaultTabs.length + 1)));
      return;
    }
    const currTab = defaultTabs.find((tab) => tab.link === pathname);
    if (currTab) {
      dispatch(setCurrentTab(currTab.index ?? 0));
    }
  }, [pathname]);

  const elements = [
    <>
      <ViewRecipes />
    </>,
    <>
      <RecipeDetails />
    </>,
    <>
      <AddRecipe />
      {!isAuthenticated() && (
        <LoginDialog isLoginOpen={true} setIsLoginOpen={setIsLoginOpen} />
      )}
    </>,
    <>
      <GroceryList />
      {!isAuthenticated() && (
        <LoginDialog isLoginOpen={true} setIsLoginOpen={setIsLoginOpen} />
      )}
    </>,
    <>
      <MealLog />
      {!isAuthenticated() && (
        <LoginDialog isLoginOpen={true} setIsLoginOpen={setIsLoginOpen} />
      )}
    </>,
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const recentlyVisitedPanel = (
    <div style={{ paddingTop: isMobile ? "40px" : undefined }}>
      {lsMedium && (
        <>
          <List>
            {isAuthenticated() ? (
              <List>
                {defaultTabs.map((page: TabItem) => (
                  <ListItem key={page.link}>
                    <ListItemButton
                      disableRipple
                      onClick={() => navigate(page.link)}
                    >
                      <ListItemText primary={page.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem>
                  <ListItemButton disableRipple onClick={() => signOut()}>
                    <ListItemText primary={"Logout"} />
                  </ListItemButton>
                </ListItem>
              </List>
            ) : (
              <List>
                <ListItem>
                  <ListItemButton
                    disableRipple
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <ListItemText primary={"Login"} />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    disableRipple
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <ListItemText primary={"Sign Up"} />
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    disableRipple
                    onClick={() => navigate("/view")}
                  >
                    <ListItemText primary={"View Recipes"} />
                  </ListItemButton>
                </ListItem>
              </List>
            )}
          </List>
          <Divider />
        </>
      )}
      <Typography variant="body1" color="sage" sx={{ padding: "10px 15px 0" }}>
        Recently Visited
      </Typography>
      <List>
        {tabsList.map((tab, index) => {
          return (
            <ListItem
              key={index}
              disablePadding
              className="tab-item"
              secondaryAction={
                <IconButton
                  size="small"
                  component="span"
                  disableRipple
                  onClick={(event) => {
                    dispatch(popTab(tab.link));
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                disableRipple
                selected={currentTab === index}
                onClick={(event) => handleListItemClick(event, index)}
              >
                <ListItemText primary={tab.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
      }}
    >
      <CssBaseline />
      <LoginDialog isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
      <Box sx={{ display: "flex", flex: 1 }}>
        <TopNav
          isMobile={isMobile}
          lsMedium={lsMedium}
          topBarHeight={topBarHeight}
          navigate={navigate}
          setSearchOpen={setSearchOpen}
          searchOpen={searchOpen}
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
          }}
          aria-label="sidebar container"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { sm: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {recentlyVisitedPanel}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                marginTop: topBarHeight,
                width: drawerWidth,
                zIndex: "0 !important",
              },
            }}
            open
          >
            {recentlyVisitedPanel}
          </Drawer>
        </Box>
        {/* page contents */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            marginTop: topBarHeight,
            padding: 0,
          }}
        >
          <Routes>
            <Route path="/" element={elements[0]} />
            <Route path="/home" element={<HomeNotLoggedIn />} />
            <Route path="/view" element={elements[0]} />
            <Route path="/view/:id" element={elements[1]} />
            <Route path="/add" element={elements[2]} />
            <Route path="/add/:id" element={elements[2]} />
            <Route path="/grocery" element={elements[3]} />
            <Route path="/log" element={elements[4]} />
          </Routes>
        </Box>
      </Box>
      <footer>
        <div className="footer-content">
          <span>
            <img
              src="/logo-white.png"
              style={{ width: "50px", marginRight: "10px" }}
            />
            UX Case Study &bull; Designed by Sara
          </span>
          <span>
            <IconButton
              onClick={() =>
                window.open("https://github.com/sara-hwang/cookbook", "_blank")
              }
              color="lightCream"
            >
              <GitHub />
            </IconButton>
          </span>
        </div>
      </footer>
    </Box>
  );
}
