import "./App.css";
import { Box } from "@mui/material";
import SearchBar from "./SearchBar";
import NavBar from "./NavBar";
import { Route, Routes } from "react-router-dom";
import ViewRecipes from "./ViewRecipes";
import AddRecipe from "./AddRecipe";
import RecipeDetails from "./RecipeDetails";

export default function App() {
  return (
    <Box sx={{ width: "100%" }}>
      <div>
        <SearchBar />
      </div>
      <div className="body-container">
        <div>
          <NavBar isActive={true} />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <ViewRecipes />
              </div>
            }
          />
          <Route
            path="/view"
            element={
              <div>
                <ViewRecipes />
              </div>
            }
          />
          <Route
            path="/add"
            element={
              <div>
                <AddRecipe />
              </div>
            }
          />
          <Route path="/view/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Box>
  );
}
