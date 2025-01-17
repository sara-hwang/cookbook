import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";
import AddMealDialog from "./AddMealDialog";

const MealLog = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      {dialogOpen && (
        <AddMealDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      )}
      <Box sx={{ padding: "24px" }}>
        <Grid container spacing={2}>
          <Grid item container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button variant="contained" onClick={() => setDialogOpen(true)}>
                Add Meal
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MealLog;
