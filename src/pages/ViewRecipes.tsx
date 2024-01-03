import { Box, Typography } from "@mui/material";
import { Recipe, EmptyRecipe } from "../constants/types";
import { useEffect, useState } from "react";
import "../stylesheets/ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getRecipesList } from "../helpers";
import { setRecipesList } from "../redux/recipesList";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css";

const ViewRecipes = () => {
  const dispatch = useAppDispatch();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(1000);
  const { searchTags } = useAppSelector((state: RootState) => state.searchTags);
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const cardSpacing = 10;
  const cardsPerRow = width > 800 ? 4 : width > 600 ? 3 : 2;
  const cardWidth = `calc(${100 / cardsPerRow}% - ${cardSpacing * 2}px)`;
  const cardWidthPixels = width / cardsPerRow - cardSpacing * 2;

  async function getRecipes() {
    setLoading(true);
    const recipes = await getRecipesList();
    setLoading(false);
    dispatch(setRecipesList(recipes.toReversed()));
  }

  useEffect(() => {
    getRecipes();

    const recipeGridContainer = document.getElementById("view-recipes-box");
    if (recipeGridContainer)
      new ResizeObserver(() => {
        setWidth(recipeGridContainer?.offsetWidth ?? 0);
      }).observe(recipeGridContainer);
    // const scrollpos = sessionStorage.getItem("scrollpos");
    // if (scrollpos) {
    //   setTimeout(function () {
    //     window.scrollTo({ top: +scrollpos });
    //     localStorage.setItem("scrollpos", "" + "0");
    //   }, 50);
    // }
  }, []);

  useEffect(() => {
    getRecipes();
  }, [searchTags]);

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
  }, [recipesList]);

  const defaultCategories =
    searchTags.length > 0
      ? ["All"]
      : [
          "Breakfast",
          "Dessert",
          "Vegetarian",
          "Vegan",
          "Easy",
          "Instant Pot",
          "All",
        ];
  return (
    <Box sx={{ marginTop: `${cardSpacing * 2}px` }}>
      {defaultCategories.map((category) => {
        return category === "All" ? (
          <div className="recipe-grid-container" key={category}>
            <Typography
              variant="h4"
              style={{ paddingLeft: `${cardSpacing * 2}px` }}
            >
              {category}
            </Typography>
            <Box style={{ padding: `${cardSpacing}px` }} id="view-recipes-box">
              {loading &&
                [...Array(12).keys()].map((key) => (
                  <RecipeCard
                    cardSpacing={cardSpacing}
                    cardWidth={cardWidth}
                    cardWidthPixels={cardWidthPixels}
                    isSkeleton={true}
                    key={key}
                    recipe={EmptyRecipe}
                  />
                ))}
              {recipes.map((recipe) => (
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
          </div>
        ) : (
          <div
            key={category}
            style={{
              padding: `0 ${cardSpacing * 2}px ${cardSpacing * 2}px`,
              maxWidth: width,
            }}
          >
            <Typography variant="h4">{category}</Typography>
            <Splide
              options={{
                type: "loop",
                perPage: cardsPerRow,
                drag: "free",
                perMove: cardsPerRow,
                gap: cardSpacing,
              }}
            >
              {(loading
                ? [...Array(cardsPerRow).keys()]
                : recipes.filter((recipe) =>
                    recipe.tags.some((tag) => tag === category.toLowerCase())
                  )
              ).map((item) => (
                <SplideSlide key={typeof item == "number" ? item : item.key}>
                  <RecipeCard
                    cardSpacing={0}
                    cardWidth={"99%"}
                    cardWidthPixels={cardWidthPixels}
                    isSkeleton={loading}
                    recipe={typeof item === "object" ? item : EmptyRecipe}
                  />
                </SplideSlide>
              ))}
            </Splide>
          </div>
        );
      })}
    </Box>
  );
};

export default ViewRecipes;
