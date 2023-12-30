import React, { useEffect, useState } from "react";
import "./stylesheets/App.css";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  Casino,
  Close,
  Menu,
  MenuBook,
  PostAdd,
  ShoppingCart,
} from "@mui/icons-material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ViewRecipes from "./pages/ViewRecipes";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import LoginDialog from "./pages/Login";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";
import GroceryList from "./pages/GroceryList";
import { popTab, pushTab, setCurrentTab } from "./redux/tabsList";
import { RootState } from "./redux/store";
import { setSearchTags } from "./redux/searchTags";
import SearchBar from "./components/SearchBar";
import { getRecipesList } from "./helpers";
import { setRecipesList } from "./redux/recipesList";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [randomDisabled, setRandomDisabled] = useState(false);
  const { tabsList, currentTab } = useAppSelector(
    (state: RootState) => state.tabsList
  );
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    dispatch(setCurrentTab(index));
    setMobileOpen(false);
  };

  useEffect(() => {
    if (
      currentTab < 0 &&
      pathname !== defaultTabs[currentTab + defaultTabs.length].link
    ) {
      navigate(defaultTabs[currentTab + defaultTabs.length].link);
    } else if (currentTab >= 0 && pathname !== tabsList[currentTab].link) {
      navigate(tabsList[currentTab].link);
    }
  }, [currentTab]);

  useEffect(() => {
    if (pathname == "/" || pathname == "/view") {
      dispatch(setCurrentTab(-3));
    } else if (pathname == "/add") {
      dispatch(setCurrentTab(-2));
    } else if (pathname == "/grocery") {
      dispatch(setCurrentTab(-1));
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
  ];

  const defaultTabs = [
    {
      label: "View Recipes",
      icon: <MenuBook fontSize="small" sx={{ marginRight: 1 }} />,
      link: "/view",
    },
    {
      label: "Add Recipe",
      icon: <PostAdd fontSize="small" sx={{ marginRight: 1 }} />,
      link: "/add",
    },
    {
      label: "Grocery List",
      icon: <ShoppingCart fontSize="small" sx={{ marginRight: 1 }} />,
      link: "/grocery",
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <img
          src="/logo.png"
          width="220"
          height="100"
          style={{ cursor: "pointer", marginTop: "10px", marginLeft: "-10px" }}
          onClick={() => {
            dispatch(setCurrentTab(-defaultTabs.length));
            dispatch(setSearchTags([]));
          }}
        />
      </Toolbar>
      <List>
        {defaultTabs.map(({ label, icon, link }, index) => (
          <ListItem
            key={index}
            disablePadding
            className={link === "/view" ? "view-recipes-tab" : undefined}
            secondaryAction={
              link === "/view" && (
                <Tooltip title="Random Recipe" disableInteractive arrow>
                  <IconButton
                    size="small"
                    component="span"
                    disableRipple
                    className={randomDisabled ? "random-disabled" : undefined}
                    // add a timeout otherwise spam-clicking leads to bugs
                    onClick={
                      randomDisabled
                        ? undefined
                        : async () => {
                            setRandomDisabled(true);
                            setTimeout(() => {
                              setRandomDisabled(false);
                            }, 1000);
                            let recipes = [];
                            if (recipesList.length == 0)
                              recipes = await getRecipesList();
                            else recipes = recipesList;
                            const randomIndex = Math.floor(
                              Math.random() * recipes.length
                            );
                            dispatch(
                              pushTab({
                                label: recipes[randomIndex].title,
                                link: `/view/${recipes[randomIndex].key}`,
                              })
                            );
                          }
                    }
                  >
                    <Casino fontSize="small" />
                  </IconButton>
                </Tooltip>
              )
            }
          >
            <ListItemButton
              selected={currentTab === index - defaultTabs.length}
              onClick={(event) =>
                handleListItemClick(event, index - defaultTabs.length)
              }
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <LoginDialog isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            // backgroundColor: "#83b6b9",
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            zIndex: 1,
          }}
        >
          <Toolbar sx={{ padding: "10px !important" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <Menu />
            </IconButton>
            <SearchBar />
            <Button
              color="inherit"
              disableRipple
              sx={{ marginLeft: 1 }}
              onClick={() => {
                isAuthenticated() ? signOut() : setIsLoginOpen(true);
              }}
            >
              {isAuthenticated() ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          padding: 0,
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={elements[0]} />
          <Route path="/view" element={elements[0]} />
          <Route path="/view/:id" element={elements[1]} />
          <Route path="/add" element={elements[2]} />
          <Route path="/add/:id" element={elements[2]} />
          <Route path="/grocery" element={elements[3]} />
        </Routes>
      </Box>
    </Box>
  );
}
