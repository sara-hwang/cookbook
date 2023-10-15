import { Box, Grid, Paper } from "@mui/material";
import { Recipe, TabItem } from "./types";
import { useEffect, useState } from "react";
import "./App.css";
import RecipeDetails from "./RecipeDetails";
import { getAllRecipes } from "./api";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";
import { pushTab } from "./redux/tabsList";

const ViewRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    async function loadRecipes() {
      setRecipes(await getAllRecipes());
    }
    loadRecipes();
  }, []);
  const dispatch = useAppDispatch();

  return (
    <React.Fragment>
      <Paper>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {recipes &&
              recipes.map((recipe) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    xl={1}
                    key={recipes.indexOf(recipe)}
                  >
                    <input
                      type="image"
                      width="200"
                      height="200"
                      src={recipe.photo}
                      alt="Recipe Photo"
                      onClick={() => {
                        const path = `/view/${recipe.title}`;
                        const newTab: TabItem = {
                          label: recipe.title,
                          link: path,
                        };
                        dispatch(pushTab(newTab));
                        navigate(path);
                      }}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default ViewRecipes;
