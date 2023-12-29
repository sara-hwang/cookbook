import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#f4bfb3",
      main: "#d92a02",
      dark: "#ae2202",
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
