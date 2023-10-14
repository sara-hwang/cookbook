import { Box, Grid, Paper } from "@mui/material";
import { Recipe } from "./types";

interface IProps {
  recipe: Recipe;
}

const RecipeDetails = ({ recipe }: IProps) => {
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
