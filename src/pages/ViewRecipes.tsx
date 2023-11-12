import { Box, Grid } from "@mui/material";
import { Recipe, DEFAULT_PHOTO } from "../constants/types";
import { useEffect, useState } from "react";
import "../stylesheets/App.css";
import "../stylesheets/ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getRecipesList } from "../helpers";
import { setRecipesList } from "../redux/recipesList";
import { pushTab } from "../redux/tabsList";

const ViewRecipes = () => {
  const dispatch = useAppDispatch();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchTags } = useAppSelector((state: RootState) => state.searchTags);
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList,
  );

  useEffect(() => {
    async function getRecipes() {
      setLoading(true);
      const recipes = await getRecipesList();
      setLoading(false);
      dispatch(setRecipesList(recipes.toReversed()));
    }
    if (recipesList.length === 0) {
      getRecipes();
    }
  }, []);

  useEffect(() => {
    setRecipes(
      searchTags.length > 0
        ? recipesList.filter(
            (recipe: Recipe) =>
              searchTags.every((tag) => recipe.tags.includes(tag)) ||
              searchTags.every((tag) =>
                recipe.ingredients.map((ing) => ing.element).includes(tag),
              ),
          )
        : recipesList,
    );
  }, [searchTags, recipesList]);

  return (
    <Box className="recipe-grid-container">
      <Grid container spacing={3}>
        {loading && (
          <div className="loading-text">
            loading (may take up to 1 minute on first render)...
          </div>
        )}
        {recipes &&
          recipes.map((recipe) => {
            return (
              <Grid item key={recipe.key}>
                <div className="image-container ">
                  <img
                    className="recipe-photo"
                    loading="lazy"
                    src={recipe.photo ?? DEFAULT_PHOTO}
                    alt={recipe.title}
                  />
                  <div
                    className="overlay"
                    onClick={() => {
                      dispatch(
                        pushTab({
                          label: recipe.title,
                          link: `/view/${recipe.key}`,
                        }),
                      );
                    }}
                  >
                    {recipe.title}
                  </div>
                </div>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default ViewRecipes;
