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
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroceryList from "./pages/GroceryList";

export default function App() {
  const { pathname } = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGroceryOpen, setIsGroceryOpen] = useState(false);
  const [navBarVisible, setNavBarVisible] = useState(false);
  const [topPosition, setTopPosition] = useState(0);
  useEffect(() => {
    setNavBarVisible(window.innerWidth > 600);
  }, [pathname]);

  useEffect(() => {
    setTopPosition(
      document.getElementById("search-bar")?.getBoundingClientRect().height ??
        50
    );
  }, []);

  const searchBarElement = document.getElementById("search-bar");
  if (searchBarElement) {
    const resizeObserver = new ResizeObserver(() => {
      setTopPosition(
        document.getElementById("search-bar")?.getBoundingClientRect().height ??
          50
      );
    });
    resizeObserver.observe(searchBarElement);
  }

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
        <Login isLoginOpen={true} setIsLoginOpen={setIsLoginOpen} />
      )}
    </>,
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
      <GroceryList
        isGroceryOpen={isGroceryOpen}
        setIsGroceryOpen={setIsGroceryOpen}
      />
      <div className="top-bar-container">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: navBarVisible ? "var(--TabBlue)" : "transparent",
            alignItems: "center",
          }}
        >
          {navBarVisible && (
            <img
              src="/logo.png"
              width="150"
              height="50"
              style={{ marginLeft: "5px" }}
            />
          )}
          <IconButton
            disableRipple
            style={{ padding: "0 5px 0 0" }}
            onClick={() => setNavBarVisible(!navBarVisible)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </div>
        <div id="search-bar" style={{ width: "100%" }}>
          <SearchBar />
        </div>
        <div className="side-by-side-container">
          <Tooltip title="Grocery List">
            <IconButton
              disableRipple
              sx={{
                paddingLeft: 0,
                "&:hover": { color: "var(--ThemeBlue)" },
              }}
              onClick={() => {
                isAuthenticated()
                  ? setIsGroceryOpen(true)
                  : setIsLoginOpen(true);
              }}
            >
              <ReceiptLongIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          {isAuthenticated() ? (
            <Tooltip title="Logout">
              <IconButton
                disableRipple
                sx={{ padding: "0 5px 0 0", "&:hover": { color: "red" } }}
                onClick={signOut}
              >
                <LogoutIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Login">
              <IconButton
                disableRipple
                sx={{
                  padding: "0 5px 0 0",
                  "&:hover": { color: "var(--ThemeBlue)" },
                }}
                onClick={() => setIsLoginOpen(true)}
              >
                <LoginIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="side-by-side-container">
        <div
          style={{
            position: "sticky",
            top: topPosition,
            height: topPosition,
          }}
        >
          <NavBar navBarVisible={navBarVisible} />
        </div>
        <div style={{ width: "100%" }}>
          <div
            style={{
              position: "sticky",
              top: topPosition,
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
