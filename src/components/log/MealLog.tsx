import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddMealDialog from "./AddMealDialog";
import { getMealEntry } from "../../utils/api";
import { useAuthUser } from "react-auth-kit";
import { MealEntry } from "../../utils/types";

const MealLog = () => {
  const authUser = useAuthUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [meals, setMeals] = useState<Map<string, MealEntry[]>>(new Map());

  useEffect(() => {
    getMeals();
    console.log(meals);
  }, []);

  const getMeals = async () => {
    const mealEntries = await getMealEntry(authUser()?.username);
    if (!mealEntries) {
      return;
    }
    const updatedMeals = new Map();
    mealEntries.data.forEach((entry: MealEntry) => {
      const currentMeals = updatedMeals.get(entry.date);
      if (currentMeals == undefined) {
        updatedMeals.set(entry.date, [entry]);
      } else {
        updatedMeals.set(entry.date, [...currentMeals, entry]);
      }
    });
    setMeals(updatedMeals);
  };

  const renderMeals = () => {
    const renderedMeals = [];
    for (const [key, value] of meals) {
      renderedMeals.push(
        <Grid size={12}>
          <Typography>{key}</Typography>
          {value.map((meal, index) => {
            return (
              <Grid key={index}>
                <Typography>{`${meal.title}: `}</Typography>
                <Typography>{`${meal.portions} serving ${meal.recipe}`}</Typography>
              </Grid>
            );
          })}
        </Grid>
      );
    }
    return renderedMeals;
  };

  return (
    <>
      {dialogOpen && (
        <AddMealDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      )}
      <Box sx={{ padding: "24px" }}>
        <Grid container spacing={2}>
          <Grid direction="column">Meal History</Grid>
          <Grid offset={{ xs: "auto" }}>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Add Meal
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>{renderMeals().map((element) => element)}</Grid>
      </Box>
    </>
  );
};

export default MealLog;
