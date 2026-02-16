import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { getRecipeDetails, getRecipesList } from "../utils/helpers";
import { EmptyRecipe, Recipe } from "../utils/types";
import "../stylesheets/HomeNotLoggedIn.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { setRecipesList } from "../redux/recipesList";
import RecipeCard from "../components/recipes/view/all/RecipeCard";
import theme from "../utils/theme";
import { useNavigate } from "react-router-dom";

const HomeNotLoggedIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const lsMedium = useMediaQuery(theme.breakpoints.down("md"));

  const cardSpacing = 10;
  const cardsPerRow = width > 1000 ? 5 : width > 800 ? 4 : width > 600 ? 3 : 2;
  const cardWidth = `calc(${100 / cardsPerRow}% - ${(cardSpacing * 2 * (cardsPerRow - 1)) / cardsPerRow}px)`;
  const cardWidthPixels =
    width / cardsPerRow - (cardSpacing * 2 * (cardsPerRow - 1)) / cardsPerRow;
  const featuredRecipeID = "veggie-pesto-fettuccine-with-garlic-shrimp";
  const [featuredRecipeDetails, setFeaturedRecipeDetails] =
    useState<Recipe | null>(null);
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );

  async function getRecipes() {
    setLoading(true);
    const recipes = await getRecipesList();
    setLoading(false);
    dispatch(
      setRecipesList(
        recipes.sort((a: Recipe, b: Recipe) => b.dateAdded - a.dateAdded)
      )
    );
  }

  useEffect(() => {
    getRecipeDetails(featuredRecipeID).then((details) => {
      setFeaturedRecipeDetails(details);
    });
    getRecipes();

    const recipeGridContainer = document.getElementById("view-recipes-box");
    if (recipeGridContainer)
      new ResizeObserver(() => {
        setWidth(recipeGridContainer?.offsetWidth ?? 0);
      }).observe(recipeGridContainer);
  }, []);

  (useEffect(() => {
    console.log(recipesList);
  }),
    [recipesList]);

  return (
    <Box className="full-width">
      <section id="hero-section">
        <Grid container direction="row" spacing={2}>
          <Grid
            size={4}
            alignContent={"center"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "left",
              gap: 3,
              padding: 0,
            }}
            spacing={4}
          >
            <Typography variant="h4">{featuredRecipeDetails?.title}</Typography>
            <Button
              variant="contained"
              color="terracotta"
              onClick={() => navigate(`/view/${featuredRecipeDetails?.key}`)}
            >
              View Recipe
            </Button>
          </Grid>
          <Grid size={8}>
            <img
              src={featuredRecipeDetails?.photo![0]}
              alt={featuredRecipeDetails?.title}
              id="hero-image"
            />
          </Grid>
        </Grid>
      </section>
      <section id="recipe-categories-section">
        <div className="recipe-grid-container">
          <Typography
            className="section-titles"
            variant="h4"
            sx={{
              scrollMarginTop: lsMedium ? "70px" : "10px",
            }}
          >
            Recently Added
          </Typography>
          <Box
            style={{ padding: `0 0 ${cardSpacing}px` }}
            id="view-recipes-box"
          >
            {(loading
              ? [...Array(12).keys()]
              : recipesList.slice(0, cardsPerRow)
            ).map((item) => (
              <RecipeCard
                cardSpacing={cardSpacing}
                cardWidth={cardWidth}
                cardWidthPixels={cardWidthPixels}
                isSkeleton={loading}
                key={typeof item === "number" ? item : item.key}
                recipe={typeof item === "object" ? item : EmptyRecipe}
              />
            ))}
          </Box>
        </div>
        <div className="recipe-grid-container">
          <Typography
            className="section-titles"
            variant="h4"
            sx={{
              scrollMarginTop: lsMedium ? "70px" : "10px",
            }}
          >
            Breakfast
          </Typography>
          <Box
            style={{ padding: `0 0 ${cardSpacing}px` }}
            id="view-recipes-box"
          >
            {(loading
              ? [...Array(12).keys()]
              : recipesList
                  .filter((recipe) => recipe.tags.includes("breakfast"))
                  .slice(0, cardsPerRow)
            ).map((item) => (
              <RecipeCard
                cardSpacing={cardSpacing}
                cardWidth={cardWidth}
                cardWidthPixels={cardWidthPixels}
                isSkeleton={loading}
                key={typeof item === "number" ? item : item.key}
                recipe={typeof item === "object" ? item : EmptyRecipe}
              />
            ))}
          </Box>
        </div>
        <div className="recipe-grid-container">
          <Typography
            className="section-titles"
            variant="h4"
            sx={{
              scrollMarginTop: lsMedium ? "70px" : "10px",
            }}
          >
            Vegeterian
          </Typography>
          <Box
            style={{ padding: `0 0 ${cardSpacing}px` }}
            id="view-recipes-box"
          >
            {(loading
              ? [...Array(12).keys()]
              : recipesList
                  .filter((recipe) => recipe.tags.includes("vegetarian"))
                  .slice(0, cardsPerRow)
            ).map((item) => (
              <RecipeCard
                cardSpacing={cardSpacing}
                cardWidth={cardWidth}
                cardWidthPixels={cardWidthPixels}
                isSkeleton={loading}
                key={typeof item === "number" ? item : item.key}
                recipe={typeof item === "object" ? item : EmptyRecipe}
              />
            ))}
          </Box>
        </div>
        <Button
          variant="contained"
          color="terracotta"
          sx={{ display: "block", marginLeft: "auto" }}
          onClick={() => navigate("/view")}
        >
          View All Recipes
        </Button>
      </section>
    </Box>
  );
};

export default HomeNotLoggedIn;
