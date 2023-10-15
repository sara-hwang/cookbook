import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import { Ingredient, Recipe } from "./types";
import { Add, Delete } from "@mui/icons-material";
import { addRecipe } from "./api";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { setRecipeDraft } from "./redux/recipeDraft";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

const AddRecipe = () => {
  const dispatch = useAppDispatch();
  const { title, servings, ingredients, steps, photo, tags } = useAppSelector(
    (state: RootState) => state.recipeDraft
  );

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<Recipe>();
    useEffect(() => {
      dispatch(setRecipeDraft(values));
    }, [values]);
    return null;
  };

  const initialValues: Recipe = {
    title: title,
    servings: servings,
    ingredients: ingredients,
    steps: steps,
    photo: photo,
    tags: tags,
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(data: Recipe, { setSubmitting }) => {
          setSubmitting(true);
          addRecipe(data);
          setSubmitting(false);
        }}
      >
        {({ values, errors, isSubmitting }) => (
          <Form>
            <FormObserver />
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    placeholder="My Recipe Title"
                    name="title"
                    type="input"
                    as={TextField}
                    label="Title"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="servings"
                    type="number"
                    as={TextField}
                    label="Number of Servings"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FieldArray name="ingredients">
                    {(arrayHelpers) => (
                      <div>
                        <Typography variant="h6">
                          Ingredients
                          <IconButton
                            onClick={() => {
                              arrayHelpers.push({
                                amount: "",
                                element: "",
                              });
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Typography>
                        {values.ingredients?.map(
                          (ingredient: Ingredient, index) => {
                            return (
                              <div key={index}>
                                <Typography variant="h6">
                                  <Field
                                    name={`ingredients.${index}.amount`}
                                    type="number"
                                    as={TextField}
                                    label="Amount"
                                  />
                                  g
                                  <Field
                                    name={`ingredients.${index}.element`}
                                    as={TextField}
                                    label="Ingredient"
                                  />
                                  <IconButton
                                    onClick={() => {
                                      arrayHelpers.remove(index);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Typography>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </FieldArray>
                </Grid>
                <Grid item xs={12}>
                  <FieldArray name="steps">
                    {(arrayHelpers) => (
                      <div>
                        <Typography variant="h6">
                          Steps
                          <IconButton
                            onClick={() => {
                              arrayHelpers.push("");
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Typography>
                        {values.steps?.map((step, index) => {
                          return (
                            <div key={index}>
                              <Typography variant="h6">
                                {index + 1}.
                                <Field
                                  name={`steps.${index}`}
                                  label="Instructions..."
                                  as={TextField}
                                />
                                <IconButton
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Typography>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </FieldArray>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    disabled={isSubmitting}
                    type="submit"
                  >
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

export default AddRecipe;
