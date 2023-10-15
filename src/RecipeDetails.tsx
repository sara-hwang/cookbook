import { Box, Grid, Paper } from "@mui/material";
import { Recipe } from "./types";
import { useParams } from "react-router-dom";
import { getRecipe } from "./api";
import { useEffect, useState } from "react";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  useEffect(() => {
    async function getRecipeDetails() {
      setRecipe(await getRecipe(id));
    }
    getRecipeDetails();
  }, []);

  return (
    <Paper>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <pre>{JSON.stringify(recipe, null, 2)}</pre>;
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RecipeDetails;
