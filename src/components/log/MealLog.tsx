import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddMealDialog from "./AddMealDialog";
import { getMealEntry } from "../../utils/api";
import { useAuthUser } from "react-auth-kit";
import { MealEntry } from "../../utils/types";

const MealLog = () => {
  const authUser = useAuthUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [meals, setMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    getMeals();
  }, []);

  const getMeals = async () => {
    const mealEntries = await getMealEntry(authUser()?.username);
    setMeals(mealEntries?.data);
    console.log(mealEntries?.data);
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
        <Grid container>
          <>
            {meals.map((meal, index) => {
              return (
                <Grid key={index}>
                  <Typography>{String(meal.date)}</Typography>
                  <Typography>{`${meal.title}: `}</Typography>
                  <Typography>{meal.recipe}</Typography>
                  <Typography>{meal.portions}</Typography>
                </Grid>
              );
            })}
          </>
        </Grid>
      </Box>
    </>
  );
};

export default MealLog;
