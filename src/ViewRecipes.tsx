import { Box, Grid } from "@mui/material";
import { Recipe } from "./types";
import { useEffect, useState } from "react";
import "./App.css";
import "./ViewRecipes.css";
import { getAllRecipes } from "./api";
import { useNavigate } from "react-router-dom";

const ViewRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);
      setRecipes(await getAllRecipes());
      setLoading(false);
    }
    loadRecipes();
  }, []);

  return (
    <Box className="containers">
      <Grid container spacing={3}>
        {loading && (
          <div className="loading-text">
            loading (may take up to 1 minute on first render)...
          </div>
        )}
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
                      navigate(`/view/${recipe.key}`);
                    }}
                  >
                    {recipe.title}
                  </div>
                </div>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default ViewRecipes;
