import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  EmptyRecipe,
  Ingredient,
  Recipe,
  TabItem,
} from "../../../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { pushTab, setCurrentTab } from "../../../../redux/tabsList";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSearchTags } from "../../../../redux/searchTags";
import ChipDisplay from "../../../ChipDisplay";
import "./RecipeDetails.css";
import { RootState } from "../../../../redux/store";
import { getRecipeDetails, markdownParser } from "../../../../utils/helpers";
import { getGroceryList, updateGroceryList } from "../../../../utils/api";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import {
  AddShoppingCartOutlined,
  ChecklistOutlined,
  Delete,
  Edit,
  MoreVert,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import DeleteRecipeDialog from "./DeleteRecipeDialog";
import Chat from "./Chat";
import NutritionLabel from "./NutritionLabel";
import { defaultTabs } from "../../../../App";
import RecipePhotos from "./RecipePhotos";

interface RecipeDetailsProps {
  setAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
}

const RecipeDetails = ({ setAppBarTitle }: RecipeDetailsProps) => {
  const dispatch = useAppDispatch();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const theme = useTheme();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>(EmptyRecipe);
  const [servings, setServings] = useState(recipe.servings);
  const [groceryMode, setGroceryMode] = useState(false);
  const [prepareMode, setPrepareMode] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [recipeString, setRecipeString] = useState("");
  const navigate = useNavigate();
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const gtLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const lsMedium = useMediaQuery(theme.breakpoints.down("md"));

  let stepNumber = 0;

  useEffect(() => {
    if (id !== undefined) {
      if (recipesList.length === 0) {
        getRecipeDetails(id, setRecipe);
      } else {
        setRecipe(
          recipesList.find((recipe) => recipe.key === id) ?? EmptyRecipe
        );
      }
    }
  }, [id]);

  useEffect(() => {
    if (recipe?.title !== "") {
      const newTab: TabItem = {
        label: recipe.title,
        link: `/view/${id}`,
      };
      dispatch(pushTab(newTab));
      setAppBarTitle(recipe.title);
    }
    setServings(recipe.servings);
    // create recipe details string to send to chat
    let recipeString = "Recipe ingredients: ";
    recipe.ingredients.forEach((ing) => {
      if (!ing.isDivider) recipeString += ing.text + ", ";
    });
    setRecipeString(recipeString);
  }, [recipe]);

  const calculateAmount = (ingredientText: string) => {
    if (!servings || !ingredientText) return ingredientText;

    const regex = /\d+(\.\d+)?/g;
    const resultString = ingredientText.replace(regex, (match) => {
      const num = parseFloat(match);
      const doubledNumber = isNaN(num)
        ? match
        : parseFloat(
            ((num * servings) / recipe.servings).toFixed(2)
          ).toString();
      return doubledNumber;
    });

    return resultString;
  };

  const addToGrocery = async () => {
    if (!auth()?.username) {
      return;
    }
    const checkboxElement = document.getElementById("grocery-checklist");
    if (checkboxElement) {
      const response = await getGroceryList(auth()?.username);
      if (response && response.status === 200) {
        const items: Ingredient[] = response.data.grocery;
        const formData = new FormData(checkboxElement as HTMLFormElement);
        for (const [index, _] of formData.entries()) {
          const ingredient = recipe.ingredients[+index];
          items.push({ ...ingredient, text: calculateAmount(ingredient.text) });
        }
        updateGroceryList(auth()?.username, items);
      } else {
        alert("Could not add to groceries, server returned " + response?.data);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", padding: "24px" }}>
      <DeleteRecipeDialog popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
      <Grid container direction="row" spacing={2}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          size={12}>
          <Grid size={11}>
            {!lsMedium && <Typography variant="h4">{recipe.title}</Typography>}
            <div>
              {recipe.dateAdded
                ? `Added ${new Date(recipe.dateAdded).toLocaleString()}`
                : undefined}
            </div>
            {recipe.url && <a href={recipe.url}>{recipe.url}</a>}
          </Grid>
          <Grid size={1}>
            <IconButton disableTouchRipple onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <Tooltip
                title={
                  !isAuthenticated()
                    ? "You must login to edit or delete recipes"
                    : undefined
                }
                disableInteractive
              >
                <div>
                  <MenuItem
                    disabled={!isAuthenticated()}
                    onClick={() => {
                      navigate(`/add/${id}`);
                      setAnchorEl(null);
                    }}
                  >
                    <Edit fontSize="small" color="action" />
                    &nbsp;Edit
                  </MenuItem>
                  <MenuItem
                    disabled={!isAuthenticated()}
                    onClick={() => {
                      setPopupOpen(true);
                      setAnchorEl(null);
                    }}
                  >
                    <Delete fontSize="small" color="action" />
                    &nbsp;Delete
                  </MenuItem>
                </div>
              </Tooltip>
            </Menu>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          size={{
            xs: 12,
            lg: "grow"
          }}>
          <Grid size={12}>
            <div className="side-by-side-container">
              <p>Servings: &nbsp;</p>
              <TextField
                value={servings.toString()}
                id="servings"
                variant="outlined"
                type="number"
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setServings(parseInt(event.target.value));
                }}
              />
            </div>
          </Grid>
          {recipe.servingDescription && (
            <Grid size={12}>
              Serving size: {recipe.servingDescription}
            </Grid>
          )}
          <Grid size={12}>
            <Typography variant="h6">
              Ingredients
              <Tooltip
                arrow
                disableInteractive
                title={
                  isAuthenticated()
                    ? groceryMode
                      ? "Add selected ingredients to grocery list"
                      : "Enter grocery mode"
                    : "Log in to add to grocery list"
                }
              >
                <IconButton
                  disableRipple
                  sx={{ "&:hover": { color: theme.palette.primary.main } }}
                  onClick={() => {
                    groceryMode && isAuthenticated() && addToGrocery();
                    isAuthenticated() && setGroceryMode(!groceryMode);
                  }}
                >
                  {groceryMode ? (
                    <AddShoppingCartOutlined fontSize="large" />
                  ) : (
                    <ShoppingCartOutlined fontSize="large" />
                  )}
                </IconButton>
              </Tooltip>
              {groceryMode && (
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setGroceryMode(!groceryMode);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Typography>
            {groceryMode ? (
              <form id="grocery-checklist">
                {recipe?.ingredients.map((ing, index) => {
                  const parsed = markdownParser(ing.text);
                  return ing.isDivider ? (
                    <Typography variant="h6" key={index}>
                      {ing.text}
                    </Typography>
                  ) : (
                    <div
                      key={index}
                      className="checkbox-container view-recipe no-strike"
                    >
                      <input
                        type="checkbox"
                        name={"" + index}
                        id={`ingredient-checkbox-${index}`}
                      />
                      <label htmlFor={`ingredient-checkbox-${index}`}>
                        {parsed ? (
                          <>
                            {calculateAmount(parsed.rest)}
                            <a href={parsed.url}>{parsed.text}</a>
                          </>
                        ) : (
                          calculateAmount(ing.text)
                        )}
                      </label>
                    </div>
                  );
                })}
              </form>
            ) : (
              <ul>
                {recipe?.ingredients.map((ing, index) => {
                  const parsed = markdownParser(ing.text);
                  return ing.isDivider ? (
                    <Typography variant="h6" marginLeft={"-30px"} key={index}>
                      {ing.text}
                    </Typography>
                  ) : (
                    <Fragment key={index}>
                      <li>
                        {parsed ? (
                          <>
                            {calculateAmount(parsed.rest)}
                            <a href={parsed.url}>{parsed.text}</a>
                          </>
                        ) : (
                          calculateAmount(ing.text)
                        )}
                      </li>
                    </Fragment>
                  );
                })}
              </ul>
            )}
          </Grid>
          <Grid size={12}>
            <Typography variant="h6">
              Steps
              <Tooltip
                arrow
                disableInteractive
                title={prepareMode ? "Exit prepare mode" : "Enter prepare mode"}
              >
                <IconButton
                  disableRipple
                  sx={{ "&:hover": { color: theme.palette.primary.main } }}
                  onClick={() => {
                    setPrepareMode(!prepareMode);
                  }}
                >
                  <ChecklistOutlined fontSize="large" />
                </IconButton>
              </Tooltip>
            </Typography>
            {prepareMode ? (
              <form>
                {recipe?.steps.map((step, index) =>
                  step.isDivider ? (
                    <Typography variant="h6" key={index}>
                      {step.text}
                    </Typography>
                  ) : (
                    <div key={index} className="checkbox-container view-recipe">
                      <input
                        type="checkbox"
                        name={"" + index}
                        id={`step-checkbox-${index}`}
                      />
                      <label htmlFor={`step-checkbox-${index}`}>
                        {step.text}
                      </label>
                    </div>
                  )
                )}
              </form>
            ) : (
              <div>
                {recipe?.steps.map((step, index) => {
                  stepNumber++;
                  if (step.isDivider) {
                    stepNumber = 0;
                    return (
                      <Typography variant="h6" key={index}>
                        {step.text}
                      </Typography>
                    );
                  }
                  return (
                    <div key={index} className="recipe-step-text">
                      <Typography>{stepNumber + ". "}</Typography>
                      <Typography>{step.text}</Typography>
                    </div>
                  );
                })}
              </div>
            )}
          </Grid>
          <Grid sx={{ padding: "16px" }} size={12}>
            {recipe?.photo && recipe.photo.length > 0 && (
              <RecipePhotos photos={recipe.photo} />
            )}
          </Grid>
          {recipe.nutritionalValues && (
            <Grid size={12}>
              <NutritionLabel recipe={recipe} />
            </Grid>
          )}
        </Grid>
        {(recipe.notes || recipe.tags.length > 0) && (
          <Grid
            container
            className={gtLarge ? "post-it-note-container" : undefined}
            size={{
              xs: 12,
              lg: "auto"
            }}>
            <Grid container spacing={2} className={gtLarge ? "post-it-note" : undefined}>
              {recipe.notes && (
                <Grid size={12}>
                  <Typography variant="h6">{`Chef's Notes`}</Typography>
                  <div className="preserve-newlines">{recipe.notes}</div>
                </Grid>
              )}
              {recipe.tags.length > 0 && (
                <Grid size={12}>
                  <Typography variant="h6">Tags</Typography>
                  <ChipDisplay
                    tags={recipe.tags}
                    size="medium"
                    onChipClick={(tag) => {
                      dispatch(setSearchTags([tag]));
                      dispatch(setCurrentTab(-defaultTabs.length));
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        <Grid>
          <Chat recipe={recipeString} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDetails;
