import { Box, Grid, Paper } from "@mui/material";
import { Recipe, TabItem } from "./types";
import { useParams } from "react-router-dom";
import { getRecipe } from "./api";
import { useEffect, useState } from "react";
import { pushTab } from "./redux/tabsList";
import { useAppDispatch } from "./redux/hooks";

const RecipeDetails = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();
  useEffect(() => {
    async function getRecipeDetails() {
      setRecipe(await getRecipe(id));
    }
    getRecipeDetails();
    if (id != undefined) {
      const newTab: TabItem = {
        label: id,
        link: `/view/${id}`,
      };
      dispatch(pushTab(newTab));
    }
  }, [id]);

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
