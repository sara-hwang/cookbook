import React, { useEffect, useState } from "react";
import "./stylesheets/App.css";
import {
  Box,
  Button,
  Collapse,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  CalendarMonth,
  Close,
  EditNote,
  ExpandLess,
  ExpandMore,
  GitHub,
  Logout,
  MenuBook,
  PostAdd,
  Search,
  Settings,
  ShoppingCart,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
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
import MealPlanCalendar from "./components/plan/MealPlanCalendar";
import MealLog from "./components/log/MealLog";
import theme from "./utils/theme";
import HomeNotLoggedIn from "./pages/HomeNotLoggedIn";
import { TabItem } from "./utils/types";

const drawerWidth = 240;
const topBarHeight = "70px";

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

export const defaultTabs: TabItem[] = [
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

export default function App() {
  const lsMedium = useMediaQuery(theme.breakpoints.down("md"));
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

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    dispatch(setCurrentTab(index));
    setMobileOpen(false);
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
      <MealPlanCalendar />
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

  const TopNav = () => {
    const authUser = useAuthUser();
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
      null
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    return (
      <AppBar
        color="lightCream"
        elevation={0}
        position="fixed"
        style={{ borderBottom: "1px solid lightgrey" }}
      >
        <Container maxWidth="xl">
          <Toolbar style={{ height: topBarHeight }}>
            {lsMedium && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" }, padding: "0px 16px 0px 0px" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!searchOpen && (
              <img
                src="/logo.png"
                style={{ width: lsMedium ? "60px" : "100px", margin: "10px" }}
                onClick={() => navigate(isAuthenticated() ? "/" : "/home")}
              />
            )}
            {lsMedium && !searchOpen && (
              <IconButton
                color="primary"
                aria-label="open search"
                edge="start"
                onClick={() => setSearchOpen(true)}
                sx={{
                  display: { md: "none" },
                  padding: "0px",
                  marginLeft: "auto",
                }}
              >
                <Search />
              </IconButton>
            )}
            {lsMedium && searchOpen && (
              <SearchBar setSearchOpen={setSearchOpen} />
            )}
            <Box
              sx={{
                width: "100%",
                display: { xs: "none", md: "flex" },
                justifyContent: "space-between",
              }}
            >
              {isAuthenticated() &&
                defaultTabs.map((page: TabItem) => (
                  <Button
                    color="sage"
                    key={page.label}
                    onClick={() => navigate(page.link)}
                    sx={{ my: 2, display: "block", flex: "none" }}
                  >
                    {page.label}
                  </Button>
                ))}
              <Grid
                container
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "100px",
                  width: "100%",
                  justifyContent: "flex-end",
                  flexWrap: "nowrap",
                }}
              >
                <SearchBar setSearchOpen={setSearchOpen} />
                {!isAuthenticated() && (
                  <>
                    <Button
                      onClick={() => setIsLoginOpen(true)}
                      color="charcoal"
                      sx={{ my: 2, display: "block" }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => setIsLoginOpen(true)}
                      color="sage"
                      sx={{
                        my: 2,
                        color: "sage",
                        display: "block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Grid>
            </Box>
            {isAuthenticated() && (
              <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => signOut()}>
                    <Button disableRipple>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </Button>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    );
  };

  const recentlyVisitedPanel = (
    <div>
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
        <TopNav />
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
            <Route path="/plan" element={elements[4]} />
            <Route path="/log" element={elements[5]} />
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
