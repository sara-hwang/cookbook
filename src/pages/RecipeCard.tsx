import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import ChipDisplay from "../components/ChipDisplay";
import { DEFAULT_PHOTO, Recipe } from "../constants/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { pushTab } from "../redux/tabsList";
import { setSearchTags } from "../redux/searchTags";
import { RootState } from "../redux/store";
import "../stylesheets/RecipeCard.css";

interface RecipeCardProps {
  cardSpacing: number;
  cardWidth: string;
  cardWidthPixels: number;
  isSkeleton: boolean;
  recipe: Recipe;
}

const RecipeCard = ({
  cardSpacing,
  cardWidth,
  cardWidthPixels,
  isSkeleton,
  recipe,
}: RecipeCardProps) => {
  const dispatch = useAppDispatch();
  const { searchTags } = useAppSelector((state: RootState) => state.searchTags);

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

  return isSkeleton ? (
    <Card sx={{ width: cardWidth, margin: `${cardSpacing}px` }}>
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
  ) : (
    <Card
      sx={{ width: cardWidth, margin: `${cardSpacing}px` }}
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
          loading="lazy"
        />
        <CardContent className="card-content disable-scrollbars">
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
            <ChipDisplay
              tags={recipe.tags}
              size="small"
              onChipClick={(tag) => {
                if (!searchTags.includes(tag))
                  dispatch(setSearchTags([...searchTags, tag]));
              }}
            />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;
