import { Box } from "@mui/material";
import { Recipe, EmptyRecipe } from "../constants/types";
import { useEffect, useState } from "react";
import "../stylesheets/ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getRecipesList } from "../helpers";
import { setRecipesList } from "../redux/recipesList";
import RecipeCard from "./RecipeCard";

const ViewRecipes = () => {
  const dispatch = useAppDispatch();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const { searchTags } = useAppSelector((state: RootState) => state.searchTags);
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const cardSpacing = 10;
  const cardsPerRow = width > 800 ? 4 : width > 600 ? 3 : 2;
  const cardWidth = `calc(${100 / cardsPerRow}% - ${cardSpacing * 2}px)`;
  const cardWidthPixels = width / cardsPerRow - cardSpacing * 2;

  useEffect(() => {
    const recipeGridContainer = document.getElementById("view-recipes-box");
    if (recipeGridContainer)
      new ResizeObserver(() => {
        setWidth(recipeGridContainer?.offsetWidth ?? 0);
      }).observe(recipeGridContainer);
    async function getRecipes() {
      setLoading(true);
      const recipes = await getRecipesList();
      dispatch(setRecipesList(recipes.toReversed()));
      setLoading(false);
    }
    if (recipesList.length === 0) {
      getRecipes();
    }
    // const scrollpos = sessionStorage.getItem("scrollpos");
    // if (scrollpos) {
    //   setTimeout(function () {
    //     window.scrollTo({ top: +scrollpos });
    //     localStorage.setItem("scrollpos", "" + "0");
    //   }, 50);
    // }
  }, []);

  useEffect(() => {
    setRecipes(
      searchTags.length > 0
        ? recipesList.filter(
            (recipe: Recipe) =>
              searchTags.every((tag) => recipe.tags.includes(tag)) ||
              searchTags.every((tag) =>
                recipe.ingredients.map((ing) => ing.element).includes(tag)
              )
          )
        : recipesList
    );
  }, [searchTags, recipesList]);

  return (
    <Box
      className="recipe-grid-container"
      style={{
        display: "flex",
        flexWrap: "wrap",
        padding: `${cardSpacing}px`,
      }}
      id="view-recipes-box"
    >
      {loading &&
        [...Array(100).keys()].map((key) => (
          <RecipeCard
            cardSpacing={cardSpacing}
            cardWidth={cardWidth}
            cardWidthPixels={cardWidthPixels}
            isSkeleton={true}
            key={key}
            recipe={EmptyRecipe}
          />
        ))}
      {recipes &&
        recipes
          .filter((recipe) => recipe.tags.some((tag) => tag === "breakfast"))
          .map((recipe) => (
            <RecipeCard
              cardSpacing={cardSpacing}
              cardWidth={cardWidth}
              cardWidthPixels={cardWidthPixels}
              isSkeleton={false}
              key={recipe.key}
              recipe={recipe}
            />
          ))}
    </Box>
  );
};

export default ViewRecipes;
