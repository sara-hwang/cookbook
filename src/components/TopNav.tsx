import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  ListItemIcon,
} from "@mui/material";
import {
  AccountCircle,
  CalendarMonth,
  Logout,
  MenuBook,
  PostAdd,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated, useSignOut } from "react-auth-kit";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import SearchBar from "./SearchBar";
import { TabItem } from "../utils/types";

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
    width: `calc(100% - 240px)`,
    marginLeft: `240px`,
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
    label: "Meal Logging",
    icon: <CalendarMonth fontSize="small" sx={{ marginRight: 1 }} />,
    link: "/log",
    index: -1,
  },
];

interface TopNavProps {
  isMobile: boolean;
  lsMedium: boolean;
  topBarHeight: string;
  navigate: ReturnType<typeof useNavigate>;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchOpen: boolean;
  isLoginOpen: boolean;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDrawerToggle: () => void;
}

const TopNav = ({
  isMobile,
  lsMedium,
  topBarHeight,
  navigate,
  setSearchOpen,
  searchOpen,
  isLoginOpen,
  setIsLoginOpen,
  handleDrawerToggle,
}: TopNavProps) => {
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
        <Toolbar
          style={{
            height: topBarHeight,
            alignItems: isMobile ? "flex-end" : "center",
            paddingBottom: isMobile ? "10px" : undefined,
          }}
        >
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
          {!lsMedium && (
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
            <SearchBar autoFocus={true} setSearchOpen={setSearchOpen} />
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
                width: "100%",
                justifyContent: "flex-end",
                flexWrap: "nowrap",
              }}
            >
              <SearchBar autoFocus={false} setSearchOpen={setSearchOpen} />
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

export default TopNav;
