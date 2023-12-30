import { lightGreen } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // light: "#f4bfb3",
      main: lightGreen[900],
      // dark: "#ae2202",
      // contrastText: "#fff",
    },
    secondary: {
      // light: "#FFE6D7",
      main: lightGreen[200],
      // dark: "#e6cfc2",
      // contrastText: "#000",
    },
    // action: {
    // selectedOpacity: 0.3,
    // selected: "#562d2e",
    // hover: "#306B00",
    // focus: "#d92a02",
    // },
  },
});

export default theme;
