import React from "react";
import "./App.css";
import { Box, Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function App() {
  const [value, setValue] = React.useState(
    useLocation().pathname == "/" || useLocation().pathname == "/view" ? 0 : 1
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="View Recipe" component={Link} to="/view" />
          <Tab label="Add Recipes" component={Link} to="/add" />
        </Tabs>
      </Box>
    </Box>
  );
}
