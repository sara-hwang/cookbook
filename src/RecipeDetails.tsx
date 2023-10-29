import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { Recipe, TabItem } from "./types";
import { useParams } from "react-router-dom";
import { getRecipe } from "./api";
import { Fragment, useEffect, useState } from "react";
import { pushTab } from "./redux/tabsList";
import { useAppDispatch } from "./redux/hooks";

const RecipeDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>();

  async function getRecipeDetails() {
    const response = await getRecipe(id);
    if (response && response.status === 200) {
      setRecipe(response.data);
    } else {
      alert(response?.data);
    }
  }

  useEffect(() => {
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
    <Box className="containers">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Ingredients</Typography>
          <ul>
            {recipe?.ingredients.map((ing) => (
              <Fragment key={ing.element}>
                <li>
                  {ing.amount} {ing.unit} {ing.element}
                </li>
              </Fragment>
            ))}
          </ul>
          <Typography variant="h6">Steps</Typography>
          <ol>
            {recipe?.steps.map((step) => (
              <Fragment key={step}>
                <li>{step}</li>
              </Fragment>
            ))}
          </ol>
          {recipe?.photo && (
            <img
              src={recipe?.photo}
              width="400"
              height="400"
              alt={recipe.title}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDetails;
