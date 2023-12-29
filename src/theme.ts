import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // light: "#afd0d2",
      main: "#d92a02",
      dark: "#b82402",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffe9e1",
      main: "#bc8e86",
      dark: "#562d2e",
      contrastText: "#000",
    },
  },
});

export default theme;
