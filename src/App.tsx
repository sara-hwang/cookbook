import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Field, Form, Formik } from "formik";
import { Box, Paper, Grid, Button, Tab, Tabs, Typography } from "@mui/material";

import axios from "axios";
import TextField from "@mui/material/TextField";
import AddRecipe from "./AddRecipe";

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Add Recipe" />
          <Tab label="View Recipes" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AddRecipe />
      </TabPanel>
      <TabPanel value={value} index={1}>
        todo
      </TabPanel>
    </Box>
  );
}
