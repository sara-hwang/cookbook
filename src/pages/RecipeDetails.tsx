import { Box, Button, Grid, Typography } from "@mui/material";
import { EmptyRecipe, Recipe, TabItem } from "../constants/types";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { pushTab, setCurrentTab } from "../redux/tabsList";
import { useAppDispatch } from "../redux/hooks";
import { getRecipeDetails } from "../helpers";
import EditIcon from "@mui/icons-material/Edit";
import { setSearchTags } from "../redux/searchTags";
import ChipDisplay from "../components/ChipDisplay";
import "../stylesheets/RecipeDetails.css";

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
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <a href={recipe.url}>{recipe.url}</a>
        </Grid>
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
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Steps</Typography>
          <ol>
            {recipe?.steps.map((step) => (
              <Fragment key={step}>
                <li>{step}</li>
              </Fragment>
            ))}
          </ol>
        </Grid>
        <Grid item xs={12}>
          {recipe?.photo && (
            <img
              src={recipe?.photo}
              width="fit-content"
              height="fit-content"
              alt={recipe.title}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Tags</Typography>
          <ChipDisplay
            tags={recipe.tags}
            onChipClick={(tag) => {
              dispatch(setSearchTags([tag]));
              dispatch(setCurrentTab(0));
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDetails;
