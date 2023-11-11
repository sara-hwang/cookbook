import "./stylesheets/App.css";
import { Box, IconButton, Tooltip } from "@mui/material";
import SearchBar from "./components/SearchBar";
import NavBar from "./components/NavBar";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewRecipes from "./pages/ViewRecipes";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import Login from "./pages/Login";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useIsAuthenticated } from "react-auth-kit";
import { useEffect, useState } from "react";
import { useSignOut } from "react-auth-kit";
import MenuIcon from "@mui/icons-material/Menu";

export default function App() {
  const { pathname } = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isOpen, setIsOpen] = useState(false);
  const [navBarVisible, setNavBarVisible] = useState(false);
  useEffect(() => {
    setNavBarVisible(window.innerWidth > 600);
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
      {!isAuthenticated() && <Login isOpen={true} setIsOpen={setIsOpen} />}
    </>,
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Login isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="top-bar-container">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: navBarVisible ? "var(--TabBlue)" : "transparent",
          }}
        >
          {navBarVisible && (
            <img
              src="/logo.png"
              width="150"
              height="25"
              style={{ margin: "7px -5px 0px 10px" }}
            />
          )}
          <IconButton
            disableRipple
            onClick={() => setNavBarVisible(!navBarVisible)}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <SearchBar />
        {isAuthenticated() ? (
          <Tooltip title="Logout">
            <IconButton
              disableRipple
              sx={{ padding: "0 5px 0 0", "&:hover": { color: "red" } }}
              onClick={signOut}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Login">
            <IconButton
              disableRipple
              sx={{ "&:hover": { color: "var(--ThemeBlue)" } }}
              onClick={() => setIsOpen(true)}
            >
              <LoginIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className="side-by-side-container">
        <div style={{ position: "sticky", top: "40px", height: 40 }}>
          <NavBar navBarVisible={navBarVisible} />
        </div>
        <div style={{ width: "100%" }}>
          <div
            style={{
              position: "sticky",
              top: 40,
              zIndex: 1,
              borderTop: "5px solid lightblue",
            }}
          />
          <div>
            <Routes>
              <Route path="/" element={elements[0]} />
              <Route path="/view" element={elements[0]} />
              <Route path="/view/:id" element={elements[1]} />
              <Route path="/add" element={elements[2]} />
              <Route path="/add/:id" element={elements[2]} />
            </Routes>
          </div>
        </div>
      </div>
    </Box>
  );
}
