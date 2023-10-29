import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { EmptyRecipe, Recipe, TabItem } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipe } from "./api";
import { Fragment, useEffect, useState } from "react";
import { pushTab } from "./redux/tabsList";
import { useAppDispatch } from "./redux/hooks";
import { getRecipeDetails } from "./helpers";
import EditIcon from "@mui/icons-material/Edit";

const RecipeDetails = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>(EmptyRecipe);
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== undefined) {
      getRecipeDetails(id, setRecipe);
    }
  }, [id]);

  useEffect(() => {
    if (recipe?.title !== "") {
      const newTab: TabItem = {
        label: recipe.title,
        link: `/view/${id}`,
      };
      dispatch(pushTab(newTab));
    }
  }, [recipe]);

  return (
    <Box className="containers">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="body-container">
            <div>
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
            </div>
            <Button variant="contained" onClick={() => navigate(`/edit/${id}`)}>
              <EditIcon />
              &nbsp;Edit Recipe
            </Button>
          </div>
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
