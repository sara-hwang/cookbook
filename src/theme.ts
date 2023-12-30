import { lightGreen } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: lightGreen[900],
    },
    secondary: {
      main: lightGreen[200],
    },
  },
  typography: {
    fontFamily: `"Rubik", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

export default theme;
