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
import { Field, FieldArray, Form, Formik, FormikErrors } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import { EmptyRecipe, Ingredient, Recipe, Unit } from "../constants/types";
import { Add, Delete } from "@mui/icons-material";
import { addRecipe, updateRecipe, upload } from "../api";
import { RootState } from "../redux/store";
import { useEffect, useRef, useState } from "react";
import { setRecipeDraft } from "../redux/recipeDraft";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import UploadImage from "../components/UploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeDetails } from "../helpers";
import TagInput from "../components/TagInput";
import "../stylesheets/AddRecipe.css";

const AddRecipe = () => {
  const draft = useAppSelector((state: RootState) => state.recipeDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editTags, setEditTags] = useState<string[]>(draft.tags);
  const [selectedImage, setSelectedImage] = useState<File>();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Recipe>(EmptyRecipe);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      getRecipeDetails(id, setInitialValues);
    } else {
      setInitialValues(draft);
    }
  }, [id]);

  useEffect(() => {
    setEditTags(draft.tags);
  }, [draft.tags]);

  const validationSchema = yup.object({
    title: yup.string().required("Required").max(250),
    servings: yup.number().required("Required").min(0),
    ingredients: yup.array().of(
      yup.object().shape({
        amount: yup
          .number()
          .required("Required")
          .min(0, "Must be greater than 0"),
        unit: yup.string().required("Required"),
        element: yup.string().required("Required"),
      }),
    ),
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

  const saveDraft = (values: Recipe) => {
    dispatch(setRecipeDraft(values));
    alert("Draft saved!");
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (data: Recipe, { resetForm }) => {
        const key = slugify(data.title, { lower: true });
        data = { ...data, key: key, tags: editTags };
        let response;
        if (selectedImage) {
          const formData = new FormData();
          formData.append("image", selectedImage);
          const photoResponse = await upload(formData);
          if (photoResponse && photoResponse.status == 200) {
            data["photo"] = photoResponse.data.data.link;
          } else {
            alert("Could not upload photo.");
            return;
          }
        }
        if (id === undefined) {
          response = await addRecipe(data);
        } else {
          response = await updateRecipe(data);
        }
        if (response && response.status === 200) {
          resetForm();
          dispatch(setRecipeDraft(EmptyRecipe));
          navigate(`/view/${key}`);
        } else {
          alert(response?.data);
        }
      }}
    >
      {({ values, errors, isValid, isSubmitting }) => (
        <Form
          onKeyDown={(event) =>
            event.key === "Enter" ? event.preventDefault() : null
          }
        >
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
                  required
                  disabled={id !== undefined}
                  error={errors.title !== undefined}
                  helperText={
                    id
                      ? "You cannot edit a recipe title after creation."
                      : errors.title
                  }
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Field
                  placeholder="eg. https://www.allrecipes.com/"
                  name="url"
                  type="input"
                  as={TextField}
                  label="Source URL"
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="servings"
                  type="number"
                  as={TextField}
                  label="Number of Servings"
                  size="small"
                  InputProps={{
                    inputProps: { min: "0", step: "any" },
                  }}
                  error={errors.servings !== undefined}
                  helperText={errors.servings}
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
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Typography variant="h6">
                                <Field
                                  name={`ingredients.${index}.amount`}
                                  type="number"
                                  as={TextField}
                                  placeholder="Amount *"
                                  size="small"
                                  sx={{ width: "25%" }}
                                  InputProps={{
                                    inputProps: { min: "0", step: "any" },
                                  }}
                                  error={
                                    errors.ingredients &&
                                    errors.ingredients[index] &&
                                    (
                                      errors.ingredients[
                                        index
                                      ] as FormikErrors<Ingredient>
                                    ).amount !== undefined
                                  }
                                  helperText={
                                    errors.ingredients &&
                                    errors.ingredients[index] &&
                                    (
                                      errors.ingredients[
                                        index
                                      ] as FormikErrors<Ingredient>
                                    ).amount
                                  }
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
                                  placeholder="Ingredient *"
                                  size="small"
                                  sx={{ width: "65%" }}
                                  error={
                                    errors.ingredients &&
                                    errors.ingredients[index] &&
                                    (
                                      errors.ingredients[
                                        index
                                      ] as FormikErrors<Ingredient>
                                    ).element !== undefined
                                  }
                                  helperText={
                                    errors.ingredients &&
                                    errors.ingredients[index] &&
                                    (
                                      errors.ingredients[
                                        index
                                      ] as FormikErrors<Ingredient>
                                    ).element
                                  }
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
                          <Grid
                            item
                            xs={12}
                            key={index}
                            padding={0.5}
                            marginLeft={1}
                          >
                            <Typography variant="h6">
                              {index + 1}.&nbsp;
                              <Field
                                name={`steps.${index}`}
                                placeholder="Instructions..."
                                as={TextField}
                                size="small"
                                sx={{ width: "70%" }}
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
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              </Grid>
              <Grid item xs={12} md={9}>
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
                <Button
                  variant="outlined"
                  onClick={() => saveDraft(values)}
                  disabled={values === EmptyRecipe}
                  sx={{ float: "right" }}
                >
                  Save Draft
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
