import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import { Ingredient, Recipe, Unit } from "./types";
import { Add, Delete } from "@mui/icons-material";
import { addRecipe, updateRecipe } from "./api";
import { RootState } from "./redux/store";
import { useEffect, useRef, useState } from "react";
import { setRecipeDraft } from "./redux/recipeDraft";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import UploadImage from "./UploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeDetails } from "./helpers";
import TagInput from "./TagInput";
import "./AddRecipe.css";

const AddRecipe = () => {
  const { key, title, servings, ingredients, steps, photo, tags } =
    useAppSelector((state: RootState) => state.recipeDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editTags, setEditTags] = useState<string[]>(tags);
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    key: key,
    title: title,
    servings: servings,
    ingredients: ingredients,
    steps: steps,
    photo: photo,
    tags: tags,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const FormObserver: React.FC = () => {
    const { values } = useFormikContext<Recipe>();
    useEffect(() => {
      dispatch(setRecipeDraft(values));
    }, [values]);
    return null;
  };

  useEffect(() => {
    if (id !== undefined) {
      getRecipeDetails(id, setInitialValues);
    }
  }, [id]);

  const validationSchema = yup.object({
    title: yup.string().required("Please provide a title.").max(250),
  });

  const parentElement: HTMLDivElement | null =
    document.querySelector(".tag-input");
  const inputElement: HTMLInputElement | null = parentElement
    ? parentElement.querySelector("input")
    : null;

  if (parentElement && inputElement) {
    parentElement.addEventListener("click", () => {
      inputElement.focus();
    });
  }

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.target as HTMLInputElement).value !== "" &&
      !editTags.includes((event.target as HTMLInputElement).value)
    ) {
      setEditTags([...editTags, (event.target as HTMLInputElement).value]);
      (event.target as HTMLInputElement).value = "";
    }
  };

  const removeTag = (indexToRemove: number) => {
    setEditTags([...editTags.filter((_, index) => index !== indexToRemove)]);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (data: Recipe, { resetForm }) => {
        const key = slugify(data.title, { lower: true });
        let response;
        data = { ...data, key: key, tags: editTags };
        if (id === undefined) {
          response = await addRecipe(data);
        } else {
          response = await updateRecipe(data);
        }
        if (response && response.status === 200) {
          resetForm();
          navigate(`/view/${key}`);
        } else {
          alert(response?.data);
        }
      }}
    >
      {({ values, errors, isValid, isSubmitting, setFieldValue }) => (
        <Form
          onKeyDown={(event) =>
            event.key === "Enter" ? event.preventDefault() : null
          }
        >
          <FormObserver />
          <Box className="containers">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  placeholder="My Recipe Title"
                  name="title"
                  type="input"
                  as={TextField}
                  label="Title"
                  fullWidth
                  disabled={id !== undefined}
                  error={errors.title !== undefined}
                  helperText={
                    id
                      ? "You cannot edit a recipe title after creation."
                      : errors.title
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="servings"
                  type="number"
                  as={TextField}
                  label="Number of Servings"
                  size="small"
                />
              </Grid>
              <Grid item container>
                <FieldArray name="ingredients">
                  {(arrayHelpers) => (
                    <div>
                      <Typography variant="h6">
                        Ingredients
                        <IconButton
                          onClick={() => {
                            arrayHelpers.push({
                              amount: "",
                              unit: "g",
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
                            <Grid
                              item
                              key={index}
                              xs={12}
                              padding={0.5}
                              marginLeft={1}
                            >
                              <Typography variant="h6">
                                <Field
                                  name={`ingredients.${index}.amount`}
                                  type="number"
                                  as={TextField}
                                  placeholder="Amount"
                                  size="small"
                                />
                                <Field
                                  name={`ingredients.${index}.unit`}
                                  type="number"
                                  as={Select}
                                  size="small"
                                  className="text-field-input"
                                >
                                  {Object.values(Unit)
                                    .filter((unit) => typeof unit == "string")
                                    .map((unit) => (
                                      <MenuItem key={unit} value={unit}>
                                        {unit}
                                      </MenuItem>
                                    ))}
                                </Field>
                                <Field
                                  name={`ingredients.${index}.element`}
                                  as={TextField}
                                  placeholder="Ingredient"
                                  size="small"
                                />
                                <IconButton
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Typography>
                            </Grid>
                          );
                        },
                      )}
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item container xs={12}>
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
                          <Grid item key={index} padding={0.5} marginLeft={1}>
                            <Typography variant="h6">
                              {index + 1}.&nbsp;
                              <Field
                                name={`steps.${index}`}
                                placeholder="Instructions..."
                                as={TextField}
                                size="small"
                                multiline
                              />
                              <IconButton
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Typography>
                          </Grid>
                        );
                      })}
                    </div>
                  )}
                </FieldArray>
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="photo"
                  type="input"
                  as={UploadImage}
                  setFieldValue={setFieldValue}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">Tags</Typography>
                <div className="tag-input">
                  <Field
                    name="tags"
                    type="input"
                    as={TagInput}
                    tags={editTags}
                    inputRef={inputRef}
                    addTag={addTag}
                    removeTag={removeTag}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  {id ? "Save" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddRecipe;
