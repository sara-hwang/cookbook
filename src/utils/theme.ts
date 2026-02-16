import { grey, lightGreen } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// Augment the palette to include a lightCream color
declare module "@mui/material/styles" {
  interface Palette {
    lightCream: Palette["primary"];
    terracotta: Palette["primary"];
    sage: Palette["primary"];
    charcoal: Palette["primary"];
    moderateGrey: Palette["primary"];
    darkCream: Palette["primary"];
  }

  interface PaletteOptions {
    lightCream?: PaletteOptions["primary"];
    terracotta?: PaletteOptions["primary"];
    sage?: PaletteOptions["primary"];
    charcoal?: PaletteOptions["primary"];
    moderateGrey?: PaletteOptions["primary"];
    darkCream?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/AppBar" {
  interface AppBarPropsColorOverrides {
    lightCream: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    charcoal: true;
    moderateGrey: true;
    sage: true;
    terracotta: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsColorOverrides {
    sage: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: lightGreen[900],
    },
    secondary: {
      main: lightGreen[200],
    },
    info: {
      main: grey[900],
    },
    lightCream: {
      main: "#FAF7F2",
      contrastText: "#2E2E2E",
    },
    terracotta: {
      main: "#B4532A",
      contrastText: "#FAF7F2",
    },
    sage: {
      main: "#7A8F6A",
    },
    charcoal: {
      main: "#2E2E2E",
    },
    moderateGrey: {
      main: "#8A8A8A",
    },
    darkCream: {
      main: "#EDE7DD",
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
