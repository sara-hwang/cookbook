import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Field, Form, Formik } from "formik";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import axios from "axios";
import TextField from "@mui/material/TextField";

const App = ({}) => {
  return (
    <div>
      <Formik
        initialValues={{}}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          console.log("submtting");
          axios
            .post("http://localhost:3001/add", data)
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
          setSubmitting(false);
        }}
      >
        {({ values, errors, isSubmitting }) => (
          <Form>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Field
                    placeholder="Title"
                    name="title"
                    type="input"
                    as={TextField}
                  />
                  <Button disabled={isSubmitting} type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;
