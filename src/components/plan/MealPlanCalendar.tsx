import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/material";

const MealPlanCalendar = () => {
  return (
    <Box sx={{ padding: "24px" }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        height={400}
      />
    </Box>
  );
};

export default MealPlanCalendar;
