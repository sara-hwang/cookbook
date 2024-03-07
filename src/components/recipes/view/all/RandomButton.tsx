import { Casino } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../../../redux/hooks";
import { pushTab } from "../../../../redux/tabsList";
import { Recipe } from "../../../../utils/types";
import theme from "../../../../utils/theme";

interface RandomButtonProps {
  recipes: Recipe[];
}

const RandomButton = ({ recipes }: RandomButtonProps) => {
  const dispatch = useAppDispatch();

  return (
    <Button
      size="small"
      component="span"
      disableRipple
      variant="contained"
      color="secondary"
      sx={{
        "&:hover": {
          backgroundColor: theme.palette.secondary.main,
        },
      }}
      onClick={() => {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        dispatch(
          pushTab({
            label: recipes[randomIndex].title,
            link: `/view/${recipes[randomIndex].key}`,
          })
        );
      }}
    >
      <Casino fontSize="small" />
      &nbsp;Random
    </Button>
  );
};

export default RandomButton;
