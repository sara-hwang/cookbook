import { Box, Grid, Paper } from "@mui/material";
import { Recipe, TabItem } from "./types";
import { useEffect, useState } from "react";
import "./App.css";
import RecipeDetails from "./RecipeDetails";
import { getAllRecipes } from "./api";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <React.Fragment>
      <Box className="containers" sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {recipes &&
            recipes.map((recipe) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={2}
                  xl={1}
                  key={recipes.indexOf(recipe)}
                >
                  <div className="image-container ">
                    <input
                      style={{ width: "100%", height: "100%" }}
                      type="image"
                      src={recipe.photo}
                      alt="Recipe Photo"
                    />
                    <div
                      className="overlay"
                      onClick={() => {
                        navigate(`/view/${recipe.title}`);
                      }}
                    >
                      {recipe.title}{" "}
                    </div>
                  </div>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default ViewRecipes;
