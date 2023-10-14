import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Recipe } from "./types";
import { useEffect, useState } from "react";
import "./App.css";
import RecipeDetails from "./RecipeDetails";

const ViewRecipes = ({}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/get")
      .then((result) => {
        setRecipes(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <Paper>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {recipes &&
              recipes.map((recipe) => {
                return (
                  <Grid item xs={4}>
                    <img
                      src={recipe.photo}
                      width="200"
                      height="200"
                      onClick={() => {
                        console.log("Clicked");
                        <RecipeDetails recipe={recipe} />;
                      }}
                    ></img>
                  </Grid>
                );
              })}
          </Grid>
          <Grid container item>
            <pre>{JSON.stringify(recipes, null, 2)}</pre>;
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default ViewRecipes;
