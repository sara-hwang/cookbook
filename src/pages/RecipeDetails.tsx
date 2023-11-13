import {
  Box,
  Button,
  Grid,
  IconButton,
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
import "../stylesheets/App.css";
import { RootState } from "../redux/store";
import { getRecipeDetails } from "../helpers";
import { getGroceryList, updateGroceryList } from "../api";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import {
  AddShoppingCartOutlined,
  CancelOutlined,
  Edit,
  ShoppingCartOutlined,
} from "@mui/icons-material";

const RecipeDetails = () => {
  const dispatch = useAppDispatch();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>(EmptyRecipe);
  const [groceryMode, setGroceryMode] = useState(false);
  const navigate = useNavigate();
  const { recipesList } = useAppSelector(
    (state: RootState) => state.recipesList,
  );

  useEffect(() => {
    if (id !== undefined) {
      if (recipesList.length === 0) {
        getRecipeDetails(id, setRecipe);
      } else {
        setRecipe(
          recipesList.find((recipe) => recipe.key === id) ?? EmptyRecipe,
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
  }, [recipe]);

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
          items.push(recipe.ingredients[+index]);
        }
        updateGroceryList(auth()?.username, items);
      } else {
        alert("Could not add to groceries, server returned " + response?.data);
      }
    }
  };

  return (
    <Box className="containers">
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <div>
            <div className="side-by-side-container">
              <div className="h5">{recipe.title}</div>
              <Button
                variant="contained"
                onClick={() => navigate(`/add/${id}`)}
              >
                <Edit />
                &nbsp;Edit Recipe
              </Button>
            </div>
            {recipe.url && <a href={recipe.url}>{recipe.url}</a>}
            <p>Servings: {recipe.servings}</p>
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
                <Tooltip arrow disableInteractive title="Cancel">
                  <IconButton
                    disableRipple
                    sx={{
                      padding: 0,
                      "&:hover": { color: "red" },
                    }}
                    onClick={() => {
                      setGroceryMode(!groceryMode);
                    }}
                  >
                    <CancelOutlined fontSize="large" />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
            {groceryMode ? (
              <form id="grocery-checklist">
                {recipe?.ingredients.map((ing, index) =>
                  ing.unit ? (
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
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "10px",
                        }}
                      />
                      <label style={{ fontSize: "large" }}>
                        {ing.amount} {ing.unit} {ing.element}
                      </label>
                    </div>
                  ) : (
                    <Typography variant="h6" key={index}>
                      {ing.element}
                    </Typography>
                  ),
                )}
              </form>
            ) : (
              <ul>
                {recipe?.ingredients.map((ing, index) =>
                  ing.unit ? (
                    <Fragment key={index}>
                      <li style={{ width: "fit-content" }}>
                        {ing.amount} {ing.unit} {ing.element}
                      </li>
                    </Fragment>
                  ) : (
                    <Typography variant="h6" marginLeft={"-30px"} key={index}>
                      {ing.element}
                    </Typography>
                  ),
                )}
              </ul>
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ color: "var(--ThemeBlue) !important" }}
          >
            Steps
          </Typography>
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
              ),
            )}
          </ol>
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
              dispatch(setCurrentTab(0));
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDetails;
