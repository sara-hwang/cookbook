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
} from "@mui/material";
import { EmptyRecipe, Ingredient, Recipe, TabItem } from "../constants/types";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { pushTab, setCurrentTab } from "../redux/tabsList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSearchTags } from "../redux/searchTags";
import ChipDisplay from "../components/ChipDisplay";
import "../stylesheets/RecipeDetails.css";
import { RootState } from "../redux/store";
import { getRecipeDetails } from "../helpers";
import { getGroceryList, updateGroceryList } from "../api";
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

const RecipeDetails = () => {
  const dispatch = useAppDispatch();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>(EmptyRecipe);
  const [servings, setServings] = useState(recipe.servings);
  const [groceryMode, setGroceryMode] = useState(false);
  const [prepareMode, setPrepareMode] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
    }
    setServings(recipe.servings);
  }, [recipe]);

  const calculateAmount = (num?: number) => {
    return !servings || !num
      ? 0
      : +((num * servings) / recipe.servings).toFixed(2);
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
          items.push({
            ...recipe.ingredients[+index],
            amount: calculateAmount(recipe.ingredients[+index].amount),
          });
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
      <Grid container spacing={2}>
        <Grid
          item
          container
          xs={12}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item>
            <Typography variant="h4">{recipe.title}</Typography>
            <div>
              {recipe.dateAdded
                ? `Added ${new Date(recipe.dateAdded).toLocaleString()}`
                : undefined}
            </div>
            {recipe.url && <a href={recipe.url}>{recipe.url}</a>}
          </Grid>
          <Grid item>
            <IconButton disableTouchRipple onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  navigate(`/add/${id}`);
                  setAnchorEl(null);
                }}
              >
                <Edit fontSize="small" color="action" />
                &nbsp;Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setPopupOpen(true);
                  setAnchorEl(null);
                }}
              >
                <Delete fontSize="small" color="action" />
                &nbsp;Delete
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Typography
            variant="h6"
            className="centre-vertically"
            sx={{
              color: "var(--ThemeBlue) !important",
            }}
          >
            Ingredients
            <Tooltip
              arrow
              disableInteractive
              title={
                isAuthenticated()
                  ? groceryMode &&
                    "Click to add selected ingredients to grocery list"
                  : "Log in to add to grocery list"
              }
            >
              <IconButton
                disableRipple
                sx={{
                  padding: 0,
                  "&:hover": { color: "var(--ThemeBlue)" },
                }}
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
                sx={{
                  marginLeft: "auto",
                }}
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
              {recipe?.ingredients.map((ing, index) =>
                ing.isDivider ? (
                  <Typography variant="h6" key={index}>
                    {ing.element}
                  </Typography>
                ) : (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      margin: "8px 0px 20px 10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      name={"" + index}
                      id={`ingredient-checkbox-${index}`}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                      }}
                    />
                    <label
                      htmlFor={`ingredient-checkbox-${index}`}
                      style={{ fontSize: "large", textDecoration: "none" }}
                    >
                      {calculateAmount(ing.amount)}
                      &nbsp;
                      {ing.unit}
                      &nbsp;
                      {ing.element}
                    </label>
                  </div>
                )
              )}
            </form>
          ) : (
            <ul>
              {recipe?.ingredients.map((ing, index) =>
                ing.isDivider ? (
                  <Typography variant="h6" marginLeft={"-30px"} key={index}>
                    {ing.element}
                  </Typography>
                ) : (
                  <Fragment key={index}>
                    <li style={{ width: "fit-content" }}>
                      {calculateAmount(ing.amount)}
                      &nbsp;
                      {ing.unit}
                      &nbsp;
                      {ing.element}
                    </li>
                  </Fragment>
                )
              )}
            </ul>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ color: "var(--ThemeBlue) !important" }}
          >
            Steps
            <Tooltip
              arrow
              disableInteractive
              title={prepareMode ? "Exit prepare mode" : "Enter prepare mode"}
            >
              <IconButton
                disableRipple
                sx={{
                  padding: 0,
                  "&:hover": { color: "var(--ThemeBlue)" },
                }}
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
                step.stepNumber > 0 ? (
                  <div
                    key={index}
                    className="grocery-list"
                    style={{
                      width: "100%",
                      margin: "8px 0px 20px 10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      name={"" + index}
                      id={`step-checkbox-${index}`}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                      }}
                    />
                    <label
                      htmlFor={`step-checkbox-${index}`}
                      style={{ fontSize: "large", textDecoration: "none" }}
                    >
                      {step.stepNumber > 0 ?? null}
                      {step.text}
                    </label>
                  </div>
                ) : (
                  <Typography variant="h6" key={index}>
                    {step.text}
                  </Typography>
                )
              )}
            </form>
          ) : (
            <ol>
              {recipe?.steps.map((step, index) =>
                step.stepNumber > 0 ? (
                  <Fragment key={index}>
                    <li>
                      {step.stepNumber > 0 ?? null}
                      {step.text}
                    </li>
                  </Fragment>
                ) : (
                  <Typography variant="h6" marginLeft={"-30px"} key={index}>
                    {step.text}
                  </Typography>
                )
              )}
            </ol>
          )}
        </Grid>
        <Grid item xs={12}>
          {recipe?.photo && (
            <img
              src={recipe?.photo}
              style={{ maxWidth: "100%", width: "400px" }}
              alt={recipe.title}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Tags</Typography>
          <ChipDisplay
            tags={recipe.tags}
            onChipClick={(tag) => {
              dispatch(setSearchTags([tag]));
              dispatch(setCurrentTab(-3));
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDetails;
