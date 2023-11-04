import "./stylesheets/App.css";
import { Box, IconButton, Tooltip } from "@mui/material";
import SearchBar from "./components/SearchBar";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import ViewRecipes from "./pages/ViewRecipes";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import Login from "./pages/Login";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useIsAuthenticated } from "react-auth-kit";
import { useState } from "react";
import { useSignOut } from "react-auth-kit";

export default function App() {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="body-container">
        <SearchBar />
        {isAuthenticated() ? (
          <Tooltip title="Logout">
            <IconButton
              disableRipple
              sx={{ "&:hover": { color: "red" } }}
              onClick={signOut}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Login">
            <IconButton
              disableRipple
              sx={{ "&:hover": { color: "#1876d2" } }}
              onClick={() => setIsOpen(true)}
            >
              <LoginIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className="body-container">
        <div>
          <NavBar />
        </div>
        <Routes>
          <Route path="/" element={elements[0]} />
          <Route path="/view" element={elements[0]} />
          <Route path="/view/:id" element={elements[1]} />
          <Route path="/add" element={elements[2]} />
          <Route path="/add/:id" element={elements[2]} />
        </Routes>
      </div>
    </Box>
  );
}
