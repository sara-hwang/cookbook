import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import { Recipe, DEFAULT_PHOTO } from "../constants/types";
import { useEffect, useState } from "react";
import "../stylesheets/ViewRecipes.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { getRecipesList } from "../helpers";
import { setRecipesList } from "../redux/recipesList";
import { pushTab } from "../redux/tabsList";
import { setSearchTags } from "../redux/searchTags";

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
    const scrollpos = sessionStorage.getItem("scrollpos");
    if (scrollpos) {
      setTimeout(function () {
        window.scrollTo({ top: +scrollpos });
        localStorage.setItem("scrollpos", "" + "0");
      }, 50);
    }
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

  const handleCardHover = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const card = event.currentTarget;
    const cardContent = card.querySelector(".card-content") as HTMLElement;
    const cardContentText = card.querySelector(
      ".card-content .MuiTypography-root"
    ) as HTMLElement;
    const cardContentChips = card.querySelector(
      ".card-content .MuiTypography-root.chips-container"
    ) as HTMLElement;

    if (
      cardContent === null ||
      cardContentText === null ||
      cardContentChips === null
    )
      return;

    cardContent.style.bottom = "0";
    cardContent.style.top = "";
    cardContentText.style.whiteSpace = "normal";
    cardContentText.style.overflow = "visible";
    cardContentChips.style.whiteSpace = "normal";
    cardContentChips.style.overflow = "visible";
    const newHeight = cardContent.offsetHeight;

    const translateY = newHeight - 86;
    cardContent.style.transform = `translateY(${-translateY}px)`;
  };

  const handleCardLeave = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const card = event.currentTarget;
    const cardContent = event.currentTarget.querySelector(
      ".card-content"
    ) as HTMLElement;
    const cardContentText = card.querySelector(
      ".card-content .MuiTypography-root"
    ) as HTMLElement;
    const cardContentChips = card.querySelector(
      ".card-content .MuiTypography-root.chips-container"
    ) as HTMLElement;
    if (
      cardContent === null ||
      cardContentText === null ||
      cardContentChips === null
    )
      return;

    cardContent.style.transform = "";
    cardContent.style.bottom = "";
    cardContent.style.top = "140px";
    cardContentText.style.cssText = "";
    cardContentChips.style.cssText = "";
  };

  return (
    <Box
      className="recipe-grid-container"
      style={{ display: "flex", flexWrap: "wrap", padding: `${cardSpacing}px` }}
      id="view-recipes-box"
    >
      {loading &&
        [...Array(100).keys()].map((key) => {
          return (
            <Card
              sx={{ width: cardWidth, margin: `${cardSpacing}px` }}
              key={key}
            >
              <CardMedia>
                <Skeleton animation="wave" variant="rectangular" />
              </CardMedia>
              <CardContent className="card-content-container-skeleton">
                <Skeleton animation="wave" height="45px" />
                <span className="card-content-skeleton">
                  <Skeleton animation="wave" height="35px" width="50px" />
                  <Skeleton animation="wave" height="35px" width="80px" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      {recipes &&
        recipes.map((recipe) => {
          return (
            <Card
              sx={{ width: cardWidth, margin: `${cardSpacing}px` }}
              key={recipe.key}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardActionArea
                disableRipple
                onClick={() => {
                  dispatch(
                    pushTab({
                      label: recipe.title,
                      link: `/view/${recipe.key}`,
                    })
                  );
                  sessionStorage.setItem("scrollpos", "" + window.scrollY);
                }}
              >
                <CardMedia
                  component="img"
                  image={recipe.thumbnail ?? DEFAULT_PHOTO}
                />
                <CardContent className="card-content">
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      width: `${cardWidthPixels - 30}px`,
                    }}
                  >
                    {recipe.title}
                  </Typography>
                  <Typography
                    className="chips-container"
                    component="div"
                    sx={{
                      width: `${cardWidthPixels - 30}px`, // 30 for margin and padding
                    }}
                  >
                    {recipe.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (!searchTags.includes(tag))
                            dispatch(setSearchTags([...searchTags, tag]));
                        }}
                        className="card-chips"
                      />
                    ))}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
    </Box>
  );
};

export default ViewRecipes;
