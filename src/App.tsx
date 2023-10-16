import "./App.css";
import { Box, Grid } from "@mui/material";
import SearchBar from "./SearchBar";
import NavBar from "./NavBar";
import { useState } from "react";

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const onExpand = () => {
    setIsActive(!isActive);
  };

  console.log(isActive);
  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        className="top-bar"
        container
        spacing={3}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={isActive}>
          <SearchBar isActive={isActive} onExpand={onExpand} />
        </Grid>
        <Grid item>
          <NavBar isActive={isActive} />
        </Grid>
      </Grid>
    </Box>
  );
}
