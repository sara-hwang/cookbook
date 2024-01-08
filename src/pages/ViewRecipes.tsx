import { Box, Typography } from "@mui/material";
import { Recipe, EmptyRecipe } from "../constants/types";
import { useEffect, useLayoutEffect, useState } from "react";
import "../stylesheets/ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getRecipesList } from "../helpers";
import { setRecipesList } from "../redux/recipesList";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import RandomButton from "./RandomButton";

const ViewRecipes = () => {
  const dispatch = useAppDispatch();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [keys, setKeys] = useState([1, 2, 3, 4, 5, 6]);
  const { searchTags, searchTitle } = useAppSelector(
    (state: RootState) => state.searchTags
  );
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const cardSpacing = 10;
  const cardsPerRow = width > 1000 ? 5 : width > 800 ? 4 : width > 600 ? 3 : 2;
  const cardWidth = `calc(${100 / cardsPerRow}% - ${cardSpacing * 2}px)`;
  const cardWidthPixels = width / cardsPerRow - cardSpacing * 2;

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

  useLayoutEffect(() => {
    const tagsFilter =
      searchTags.length > 0
        ? recipesList.filter(
            (recipe: Recipe) =>
              searchTags.length &&
              searchTags.every((tag) => recipe.tags.includes(tag))
          )
        : recipesList;
    const titleFilter = searchTitle
      ? recipesList.filter((recipe: Recipe) =>
          recipe.title.toLowerCase().includes(searchTitle.toLowerCase())
        )
      : recipesList;
    setRecipes(tagsFilter.filter((recipe) => titleFilter.includes(recipe)));
    setKeys(keys.map((key) => (key *= -1)));
    setLoading(true);
  }, [recipesList, searchTitle, searchTags]);

  useEffect(() => {
    return () => setLoading(false);
  }, [recipesList, searchTitle, searchTags]);

  const defaultCategories =
    searchTags.length > 0 || searchTitle
      ? []
      : [
          "Breakfast",
          "Lunch",
          "Dinner",
          "Dessert",
          "Vegetarian",
          "Vegan",
          "Easy",
          "Instant Pot",
        ];

  return (
    <Box sx={{ marginTop: `${cardSpacing * 2}px` }}>
      {defaultCategories.map((category, index) => {
        const catRecipes = recipes.filter((recipe) =>
          recipe.tags.some((tag) => tag === category.toLowerCase())
        );
        return (
          <div
            key={category + keys[index]}
            style={{
              padding: `0 ${cardSpacing * 2}px ${cardSpacing}px`,
              maxWidth: width,
            }}
          >
            <div className="spaced-apart">
              <Typography variant="h4">{category}</Typography>
              {catRecipes.length > 0 && <RandomButton recipes={catRecipes} />}
            </div>
            <Splide
              options={{
                type: "loop",
                perPage: cardsPerRow,
                drag: "free",
                perMove: cardsPerRow,
                gap: cardSpacing * 2,
              }}
            >
              {(loading ? [...Array(cardsPerRow).keys()] : catRecipes).map(
                (item, index) => (
                  <SplideSlide key={typeof item === "number" ? item : item.key}>
                    <RecipeCard
                      cardSpacing={0}
                      cardWidth={"99%"}
                      cardWidthPixels={cardWidthPixels}
                      isSkeleton={loading}
                      recipe={typeof item === "object" ? item : EmptyRecipe}
                    />
                  </SplideSlide>
                )
              )}
            </Splide>
          </div>
        );
      })}
      <div className="recipe-grid-container">
        <div
          className="spaced-apart"
          style={{ padding: `0 ${cardSpacing * 2}px` }}
        >
          <Typography variant="h4">All</Typography>
          <RandomButton recipes={recipes} />
        </div>
        <Box
          style={{ padding: `0 ${cardSpacing}px ${cardSpacing}px` }}
          id="view-recipes-box"
        >
          {(loading ? [...Array(12).keys()] : recipes).map((item) => (
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
    </Box>
  );
};

export default ViewRecipes;
