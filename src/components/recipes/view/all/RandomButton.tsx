import { Casino } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { pushTab } from "../../../../redux/tabsList";
import { Recipe } from "../../../../utils/types";

interface RandomButtonProps {
  recipes: Recipe[];
}

const RandomButton = ({ recipes }: RandomButtonProps) => {
  const [randomDisabled, setRandomDisabled] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <Button
      size="small"
      component="span"
      disableRipple
      variant="outlined"
      color="info"
      className={randomDisabled ? "random-disabled" : undefined}
      // add a timeout otherwise spam-clicking leads to bugs
      onClick={
        randomDisabled
          ? undefined
          : async () => {
              setRandomDisabled(true);
              setTimeout(() => {
                setRandomDisabled(false);
              }, 1000);
              const randomIndex = Math.floor(Math.random() * recipes.length);
              dispatch(
                pushTab({
                  label: recipes[randomIndex].title,
                  link: `/view/${recipes[randomIndex].key}`,
                })
              );
            }
      }
    >
      <Casino fontSize="small" />
      &nbsp;Random
    </Button>
  );
};

export default RandomButton;
