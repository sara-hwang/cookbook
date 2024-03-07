import React, { useEffect, useState } from "react";
import "./stylesheets/App.css";
import {
  Box,
  Button,
  Collapse,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonth,
  Close,
  ExpandLess,
  ExpandMore,
  Logout,
  Menu,
  MenuBook,
  PostAdd,
  Settings,
  ShoppingCart,
} from "@mui/icons-material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ViewRecipes from "./components/recipes/view/all/ViewRecipes";
import AddRecipe from "./components/recipes/add/AddRecipe";
import RecipeDetails from "./components/recipes/view/details/RecipeDetails";
import LoginDialog from "./pages/Login";
import { useAuthUser, useIsAuthenticated, useSignOut } from "react-auth-kit";
import GroceryList from "./components/grocery/GroceryList";
import { popTab, setCurrentTab } from "./redux/tabsList";
import { RootState } from "./redux/store";
import SearchBar from "./components/SearchBar";
import { RecipeCategories } from "./utils/types";
import MealPlanCalendar from "./components/plan/MealPlanCalendar";
import theme from "./utils/theme";
import { lightGreen } from "@mui/material/colors";

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

const handleCategoryClick = (category: string) => {
  const element = document.getElementById(category);
  element?.scrollIntoView();
};

export const defaultTabs = [
  {
    label: "View Recipes",
    icon: <MenuBook fontSize="small" sx={{ marginRight: 1 }} />,
    link: "/view",
    index: -4,
  },
  {
    label: "Add Recipe",
    icon: <PostAdd fontSize="small" sx={{ marginRight: 1 }} />,
    link: "/add",
    index: -3,
  },
  {
    label: "Grocery List",
    icon: <ShoppingCart fontSize="small" sx={{ marginRight: 1 }} />,
    link: "/grocery",
    index: -2,
  },
  {
    label: "Meal Planning",
    icon: <CalendarMonth fontSize="small" sx={{ marginRight: 1 }} />,
    link: "/plan",
    index: -1,
  },
];

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [appBarTitle, setAppBarTitle] = useState("");
  const { tabsList, currentTab } = useAppSelector(
    (state: RootState) => state.tabsList
  );
  const [viewCategories, setViewCategories] = useState(true);
  const lsMedium = useMediaQuery(theme.breakpoints.down("md"));

  const authUser = useAuthUser();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    dispatch(setCurrentTab(index));
    setMobileOpen(false);
    setViewCategories(false);
  };

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
      dispatch(setCurrentTab(-defaultTabs.length));
      return;
    }
    const currTab = defaultTabs.find((tab) => tab.link === pathname);
    if (currTab) {
      dispatch(setCurrentTab(currTab.index));
    }
  }, [pathname]);

  const elements = [
    <>
      <ViewRecipes />
    </>,
    <>
      <RecipeDetails setAppBarTitle={setAppBarTitle} />
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
      <MealPlanCalendar />
      {!isAuthenticated() && (
        <LoginDialog isLoginOpen={true} setIsLoginOpen={setIsLoginOpen} />
      )}
    </>,
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar className="user-login-sidebar">
        {isAuthenticated() ? (
          <div className="full-width">
            <Button
              disableRipple
              fullWidth
              onClick={() => setIsUserOpen(!isUserOpen)}
            >
              <Typography variant="h5">
                <span>{`${authUser()?.username} `}</span>
                <span>{isUserOpen ? <ExpandLess /> : <ExpandMore />}</span>
              </Typography>
            </Button>
            <Collapse in={isUserOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton disableRipple disabled>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} />
                </ListItemButton>
                <ListItemButton
                  disableRipple
                  onClick={() => {
                    setIsUserOpen(false);
                    signOut();
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </List>
            </Collapse>
          </div>
        ) : (
          <Button
            color="inherit"
            disableRipple
            onClick={() => setIsLoginOpen(true)}
          >
            Login
          </Button>
        )}
      </Toolbar>
      <Divider />
      <List>
        {defaultTabs.map(({ label, icon, link }, index) => (
          <React.Fragment key={link}>
            <ListItemButton
              disableRipple
              selected={currentTab === index - defaultTabs.length}
              onClick={(event) => {
                handleListItemClick(event, index - defaultTabs.length);
                link === "/view" &&
                  (pathname !== "/view"
                    ? setViewCategories(true)
                    : setViewCategories(!viewCategories));
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
              {link === "/view" &&
                (viewCategories && pathname === "/view" ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                ))}
            </ListItemButton>
            {link === "/view" && (
              <Collapse
                in={viewCategories && pathname === "/view"}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {RecipeCategories.map((category) => (
                    <ListItemButton
                      key={category}
                      sx={{ pl: "80px" }}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <ListItemText primary={category} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
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

  useEffect(() => {
    console.log(defaultTabs.length, currentTab);
  }, [currentTab]);

  return (
    <Box sx={{ display: "flex", backgroundColor: lightGreen[50] }}>
      <CssBaseline />
      <LoginDialog isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: 2,
        }}
      >
        {lsMedium && (
          <Toolbar sx={{ padding: "10px !important" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, padding: "0 16px" }}
            >
              <Menu />
            </IconButton>
            {currentTab == -defaultTabs.length ? (
              <SearchBar />
            ) : (
              <Typography variant="h6">
                {currentTab < 0 && currentTab > -defaultTabs.length
                  ? defaultTabs[defaultTabs.length + currentTab].label
                  : appBarTitle}
              </Typography>
            )}
          </Toolbar>
        )}
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          padding: 0,
        }}
      >
        {lsMedium && <Toolbar />}
        <Routes>
          <Route path="/" element={elements[0]} />
          <Route path="/view" element={elements[0]} />
          <Route path="/view/:id" element={elements[1]} />
          <Route path="/add" element={elements[2]} />
          <Route path="/add/:id" element={elements[2]} />
          <Route path="/grocery" element={elements[3]} />
          <Route path="/plan" element={elements[4]} />
        </Routes>
      </Box>
    </Box>
  );
}
