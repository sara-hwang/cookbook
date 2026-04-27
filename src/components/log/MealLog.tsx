import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddMealDialog from "./AddMealDialog";
import { getMealEntry, getRecipe } from "../../utils/api";
import { useAuthUser } from "react-auth-kit";
import { MealEntry, Recipe, FdcNutrientId } from "../../utils/types";

const MealLog = () => {
  const authUser = useAuthUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mealDetails, setMealDetails] = useState<
    Map<
      string,
      {
        meal: MealEntry;
        recipe?: Recipe;
        calories?: number;
        macros?: { protein: number; carbs: number; fat: number };
      }[]
    >
  >(new Map());

  useEffect(() => {
    getMeals();
  }, []);

  const getMeals = async () => {
    const mealEntries = await getMealEntry(authUser()?.username);
    if (!mealEntries) {
      return;
    }
    console.log(mealEntries);
    const updatedMeals = new Map();
    const updatedMealDetails = new Map();

    // Group meals by date
    mealEntries.data.forEach((entry: MealEntry) => {
      const currentMeals = updatedMeals.get(entry.date);
      if (currentMeals == undefined) {
        updatedMeals.set(entry.date, [entry]);
      } else {
        updatedMeals.set(entry.date, [...currentMeals, entry]);
      }
    });

    // Render dates in reverse chronological order
    const sortedDates = Array.from(updatedMeals.keys()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Fetch recipe details and calculate calories for each meal
    for (const date of sortedDates) {
      const dateMeals = updatedMeals.get(date) || [];
      const detailedMeals = [];

      for (const meal of dateMeals) {
        const recipeResponse = await getRecipe(meal.recipe);
        let calories = 0;
        let macros = { protein: 0, carbs: 0, fat: 0 };

        if (recipeResponse && recipeResponse.status === 200) {
          const recipe: Recipe = recipeResponse.data;
          if (recipe.nutritionalValues) {
            // Calculate calories and macros based on portions and recipe servings
            const caloriesPerServing =
              recipe.nutritionalValues._1008 / recipe.servings;
            calories = caloriesPerServing * meal.portions;

            const proteinPerServing =
              (recipe.nutritionalValues._1003 || 0) / recipe.servings;
            const carbsPerServing =
              (recipe.nutritionalValues._1005 || 0) / recipe.servings;
            const fatPerServing =
              (recipe.nutritionalValues._1004 || 0) / recipe.servings;

            macros = {
              protein: proteinPerServing * meal.portions,
              carbs: carbsPerServing * meal.portions,
              fat: fatPerServing * meal.portions,
            };
          }

          detailedMeals.push({
            meal,
            recipe,
            calories: Math.round(calories),
            macros: {
              protein: Math.round(macros.protein * 10) / 10,
              carbs: Math.round(macros.carbs * 10) / 10,
              fat: Math.round(macros.fat * 10) / 10,
            },
          });
        } else {
          detailedMeals.push({
            meal,
            calories: 0,
            macros: { protein: 0, carbs: 0, fat: 0 },
          });
        }
      }

      updatedMealDetails.set(date, detailedMeals);
    }

    setMealDetails(updatedMealDetails);
  };

  const renderMeals = () => {
    const renderedMeals = [];
    for (const [date, meal] of mealDetails) {
      const dailyCalories = meal.reduce(
        (total, item) => total + (item.calories || 0),
        0
      );

      const dailyMacros = meal.reduce(
        (totals, item) => ({
          protein: totals.protein + (item.macros?.protein || 0),
          carbs: totals.carbs + (item.macros?.carbs || 0),
          fat: totals.fat + (item.macros?.fat || 0),
        }),
        { protein: 0, carbs: 0, fat: 0 }
      );

      renderedMeals.push(
        <Grid size={12} key={date}>
          <Card sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
              <Typography
                variant="subtitle1"
                color="sage"
                sx={{ marginBottom: 1 }}
              >
                Total Calories: {Math.round(dailyCalories)} kcal
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: 2 }}
              >
                Protein: {Math.round(dailyMacros.protein * 10) / 10}g | Carbs:{" "}
                {Math.round(dailyMacros.carbs * 10) / 10}g | Fat:{" "}
                {Math.round(dailyMacros.fat * 10) / 10}g
              </Typography>

              {meal.map((detail, index) => (
                <Box
                  key={index}
                  sx={{
                    marginBottom: 1,
                    padding: 1,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {detail.recipe?.title || detail.meal.recipe}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Portions: {detail.meal.portions}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="sage"
                    sx={{ fontWeight: "bold" }}
                  >
                    Calories: {detail.calories || 0} kcal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    P: {detail.macros?.protein || 0}g | C:{" "}
                    {detail.macros?.carbs || 0}g | F: {detail.macros?.fat || 0}g
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      );
    }
    return renderedMeals;
  };

  return (
    <>
      {dialogOpen && (
        <AddMealDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          getMeals={getMeals}
        />
      )}
      <Box sx={{ padding: "24px" }}>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid size={6}>
            <Typography variant="h5">Meal History</Typography>
          </Grid>
          <Grid size={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              color="terracotta"
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              Add Meal
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {renderMeals()}
        </Grid>
      </Box>
    </>
  );
};

export default MealLog;
