import {
  Box,
  Fab,
  Fade,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { Recipe, EmptyRecipe, RecipeCategories } from "../../../../utils/types";
import { useEffect, useLayoutEffect, useState } from "react";
import "./ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { getRecipesList } from "../../../../utils/helpers";
import { setRecipesList } from "../../../../redux/recipesList";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import RandomButton from "./RandomButton";
import { KeyboardArrowUp } from "@mui/icons-material";
import theme from "../../../../utils/theme";
import SearchBar from "../../../SearchBar";

interface ScrollTopProps {
  children: React.ReactNode;
}

const ScrollTop = (props: ScrollTopProps) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Fade in={trigger}>
      <Box className="scroll-top" onClick={() => window.scrollTo(0, 0)}>
        {children}
      </Box>
    </Fade>
  );
};

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
  const lsMedium = useMediaQuery(theme.breakpoints.down("md"));
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
    searchTags.length > 0 || searchTitle ? [] : RecipeCategories.slice(0, -1);

  return (
    <Box>
      <div style={{ padding: "15px" }}>{!lsMedium && <SearchBar />}</div>
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
              <Typography
                id={category}
                variant="h4"
                sx={{
                  scrollMarginTop: lsMedium ? "70px" : "10px",
                }}
              >
                {category}
              </Typography>
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
          <Typography
            id="All"
            variant="h4"
            sx={{
              scrollMarginTop: lsMedium ? "70px" : "10px",
            }}
          >
            {`All (${recipes.length})`}
          </Typography>
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
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default ViewRecipes;
