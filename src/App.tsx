import React from "react";
import "./App.css";
import { Box, Tab, Tabs } from "@mui/material";

import AddRecipe from "./AddRecipe";
import ViewRecipes from "./ViewRecipes";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="View Recipe" />
          <Tab label="Add Recipes" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ViewRecipes />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddRecipe />
      </TabPanel>
    </Box>
  );
}
