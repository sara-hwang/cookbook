import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Recipe, DEFAULT_PHOTO } from "../constants/types";
import { useEffect, useState } from "react";
import "../stylesheets/App.css";
import "../stylesheets/ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getRecipesList } from "../helpers";
import { setRecipesList } from "../redux/recipesList";
import { pushTab } from "../redux/tabsList";
import ChipDisplay from "../components/ChipDisplay";
import { setSearchTags } from "../redux/searchTags";

const ViewRecipes = () => {
  const dispatch = useAppDispatch();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
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

  const recipeGridContainer = document.getElementById("view-recipes-box");
  if (recipeGridContainer)
    new ResizeObserver(() => {
      setWidth(recipeGridContainer?.offsetWidth ?? 0);
    }).observe(recipeGridContainer);

  const cardSpacing = 10;
  const cardsPerRow = width > 800 ? 4 : width > 500 ? 3 : 2;
  const cardWidth = `calc(${100 / cardsPerRow}% - ${cardSpacing * 2}px)`;

  return (
    <Box
      className="recipe-grid-container"
      style={{ display: "flex", flexWrap: "wrap", padding: `${cardSpacing}px` }}
      id="view-recipes-box"
    >
      {loading && (
        <div className="loading-text">
          loading (may take up to 1 minute on first render)...
        </div>
      )}
      {recipes &&
        recipes.map((recipe) => {
          return (
            <Card
              sx={{ width: cardWidth, margin: `${cardSpacing}px` }}
              key={recipe.key}
            >
              <CardActionArea
                disableRipple
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  alignItems: "flex-start",
                }}
                onClick={() => {
                  dispatch(
                    pushTab({
                      label: recipe.title,
                      link: `/view/${recipe.key}`,
                    }),
                  );
                }}
              >
                <CardMedia
                  component="img"
                  style={{ objectFit: "cover", height: 140 }}
                  image={recipe.thumbnail ?? DEFAULT_PHOTO}
                  alt={recipe.title}
                />
                <CardContent style={{ flex: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {recipe.title}
                  </Typography>
                  <div style={{ margin: "-10px", marginTop: "10px" }}>
                    <ChipDisplay
                      tags={recipe.tags}
                      onChipClick={(tag) => {
                        if (!searchTags.includes(tag))
                          dispatch(setSearchTags([...searchTags, tag]));
                      }}
                    />
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
    </Box>
  );
};

export default ViewRecipes;
