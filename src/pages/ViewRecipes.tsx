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

  useEffect(() => {
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

  const recipeGridContainer = document.getElementById("view-recipes-box");
  if (recipeGridContainer)
    new ResizeObserver(() => {
      setWidth(recipeGridContainer?.offsetWidth ?? 0);
    }).observe(recipeGridContainer);

  const cardSpacing = 10;
  const cardsPerRow = width > 800 ? 4 : width > 500 ? 3 : 2;
  const cardWidth = `calc(${100 / cardsPerRow}% - ${cardSpacing * 2}px)`;

  const handleCardHover = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const card = event.currentTarget;
    const cardActionArea = card.querySelector(
      ".MuiCardActionArea-root"
    ) as HTMLElement;
    const cardContent = card.querySelector(".card-content") as HTMLElement;
    const cardContentText = card.querySelector(
      ".card-content .MuiTypography-root"
    ) as HTMLElement;
    const cardContentChips = card.querySelector(
      ".card-content .MuiTypography-root.chips-container"
    ) as HTMLElement;

    if (
      cardActionArea === null ||
      cardContent === null ||
      cardContentText === null ||
      cardContentChips === null
    )
      return;
    const cardActionAreaHeight = cardActionArea.offsetHeight;
    const originalHeight = cardContent.offsetHeight;
    cardContentText.style.whiteSpace = "normal";
    cardContentText.style.overflow = "visible";
    cardContentChips.style.whiteSpace = "normal";
    cardContentChips.style.overflow = "visible";
    const newHeight = cardContent.offsetHeight;

    const translateY = newHeight - originalHeight;
    cardContent.style.transform = `translateY(${-translateY}px)`;
    cardContent.style.height = originalHeight + "px";
    cardActionArea.style.height = cardActionAreaHeight + "px";
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
    cardContent.style.height = "100%";
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
                <Skeleton animation="wave" />
                <span className="card-content-skeleton">
                  <Skeleton animation="wave" width="50px" />
                  <Skeleton animation="wave" width="80px" />
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
                  <Typography gutterBottom variant="h6" component="div">
                    {recipe.title}
                  </Typography>
                  <Typography className="chips-container">
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
