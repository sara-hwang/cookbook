import "./stylesheets/App.css";
import { Box } from "@mui/material";
import SearchBar from "./SearchBar";
import NavBar from "./NavBar";
import { Route, Routes } from "react-router-dom";
import ViewRecipes from "./pages/ViewRecipes";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";

export default function App() {
  return (
    <Box sx={{ width: "100%" }}>
      <div>
        <SearchBar />
      </div>
      <div className="body-container">
        <div>
          <NavBar />
        </div>
        <Routes>
          <Route path="/" element={<ViewRecipes />} />
          <Route path="/view" element={<ViewRecipes />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/view/:id" element={<RecipeDetails />} />
          <Route path="/edit/:id" element={<AddRecipe />} />
        </Routes>
      </div>
    </Box>
  );
}
