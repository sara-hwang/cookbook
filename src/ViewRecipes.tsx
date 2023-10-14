import { Box, Grid, Paper } from "@mui/material";
import { Recipe } from "./types";
import { useEffect, useState } from "react";
import "./App.css";
import RecipeDetails from "./RecipeDetails";
import { getAllRecipes } from "./api";

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    async function loadRecipes() {
      setRecipes(await getAllRecipes());
    }
    loadRecipes();
  }, []);

  return (
    <div>
      <Paper>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {recipes &&
              recipes.map((recipe) => {
                return (
                  <Grid item xs={4} key={recipes.indexOf(recipe)}>
                    <img
                      alt="Recipe Photo"
                      src={recipe.photo}
                      width="200"
                      height="200"
                      onClick={() => {
                        console.log("Clicked");
                        <RecipeDetails recipe={recipe} />;
                      }}
                    ></img>
                  </Grid>
                );
              })}
          </Grid>
          <Grid container item>
            <pre>{JSON.stringify(recipes, null, 2)}</pre>;
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default ViewRecipes;
