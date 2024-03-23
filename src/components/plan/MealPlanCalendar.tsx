import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";
import AddMealDialog from "./AddMealDialog";

const MealPlanCalendar = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <Box sx={{ padding: "24px" }}>
      <AddMealDialog setIsAddOpen={setIsAddOpen} isAddOpen={isAddOpen}/>
      <Grid>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <Button
              color="inherit"
              disableRipple
              onClick={() => setIsAddOpen(true)}
            >
              Add Meal
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridWeek"
              height={400}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MealPlanCalendar;
