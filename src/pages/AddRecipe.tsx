import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik, FormikErrors } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import {
  EmptyRecipe,
  Ingredient,
  Recipe,
  Step,
  Unit,
} from "../constants/types";
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
import "../stylesheets/App.css";
import { setRecipesList } from "../redux/recipesList";

const AddRecipe = () => {
  const draft = useAppSelector((state: RootState) => state.recipeDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editTags, setEditTags] = useState<string[]>(draft.tags);
  const [selectedImage, setSelectedImage] = useState<File>();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Recipe>(EmptyRecipe);
  const [numDividers, setNumDividers] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      getRecipeDetails(id, setInitialValues);
    } else {
      setInitialValues(draft);
    }
  }, [id]);

  useEffect(() => {
    let dividers = 0;
    initialValues.steps.forEach((step) => {
      if (step.stepNumber === 0) {
        dividers += 1;
      }
    });
    setNumDividers(dividers);
    setEditTags(initialValues.tags);
  }, [initialValues]);

  const validationSchema = yup.object({
    title: yup.string().required("Required").max(250),
    servings: yup.number().required("Required").min(0),
    ingredients: yup.array().of(
      yup.object().shape({
        amount: yup
          .number()
          .required("Required")
          .min(0, "Must be greater than 0"),
        // unit: yup.string().required("Required"),
        element: yup.string().required("Required"),
      }),
    ),
    steps: yup.array().of(
      yup.object().shape({
        text: yup.string().required("Required"),
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

  const uploadToImgur = async (image: Blob | File) => {
    const formData = new FormData();
    formData.append("image", image);
    const photoResponse = await upload(formData);
    if (photoResponse && photoResponse.status === 200) {
      return photoResponse.data.data.link;
    } else {
      alert("Could not upload image.");
      return undefined;
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  };

  const handlePhotoField = async () => {
    if (!selectedImage) {
      return null;
    }
    try {
      // create thumbnail
      const img = await loadImage(URL.createObjectURL(selectedImage));
      const aspectRatio = img.width / img.height;
      const canvas = document.createElement("canvas");
      canvas.width = Math.min(img.width, 150);
      canvas.height = canvas.width / aspectRatio;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), undefined, 1);
      });
      // upload both images
      const original = await uploadToImgur(selectedImage);
      const thumbnail = blob ? await uploadToImgur(blob) : undefined;
      return { original: original, thumbnail: thumbnail };
    } catch (error) {
      console.error("Error during image processing:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (data: Recipe, { resetForm, setFieldValue }) => {
        const images = await handlePhotoField();
        if (images) {
          setFieldValue("photo", images.original);
          setFieldValue("thumbnail", images.thumbnail);
        }
        const key = slugify(data.title, { lower: true });
        data = { ...data, key: key, tags: editTags };
        let response;
        if (id === undefined) {
          response = await addRecipe(data);
        } else {
          response = await updateRecipe(data);
        }
        if (response && response.status === 200) {
          resetForm();
          dispatch(setRecipeDraft(EmptyRecipe));
          dispatch(setRecipesList([]));
          navigate(`/view/${key}`);
        } else {
          alert(response?.data);
        }
      }}
    >
      {({ values, errors, isValid, isSubmitting, submitForm }) => (
        <Form>
          <Box sx={{ display: "flex" }}>
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
                        <Button
                          variant="outlined"
                          onClick={() => {
                            arrayHelpers.push({
                              amount: "1",
                              unit: undefined,
                              element: "",
                            });
                          }}
                        >
                          Add Divider
                        </Button>
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
                              {ingredient.unit === undefined ? (
                                <div>
                                  <Field
                                    name={`ingredients.${index}.element`}
                                    as={TextField}
                                    placeholder="Section name *"
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
                                </div>
                              ) : (
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
                                    sx={{ width: "90px" }}
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
                              )}
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
                            arrayHelpers.push({
                              stepNumber: values.steps.length + 1 - numDividers,
                              text: "",
                            });
                          }}
                        >
                          <Add />
                        </IconButton>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            arrayHelpers.push({
                              stepNumber: 0,
                              text: "",
                            });
                            setNumDividers(numDividers + 1);
                          }}
                        >
                          Add Divider
                        </Button>
                      </Typography>
                      {values.steps?.map((step, index) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            key={index}
                            padding={0.5}
                            marginLeft={1}
                            whiteSpace={"nowrap"}
                          >
                            <Typography variant="h6">
                              {step.stepNumber > 0 && (
                                <>{step.stepNumber}.&nbsp;</>
                              )}
                              <Field
                                name={`steps.${index}.text`}
                                placeholder={
                                  step.stepNumber > 0
                                    ? "Instructions..."
                                    : "Section name..."
                                }
                                as={TextField}
                                size="small"
                                multiline={step.stepNumber > 0 ?? undefined}
                                rows={2}
                                sx={{
                                  width:
                                    step.stepNumber > 0 ? "80%" : undefined,
                                }}
                                error={
                                  errors.steps &&
                                  errors.steps[index] &&
                                  (errors.steps[index] as FormikErrors<Step>)
                                    .text !== undefined
                                }
                                helperText={
                                  errors.steps &&
                                  errors.steps[index] &&
                                  (errors.steps[index] as FormikErrors<Step>)
                                    .text
                                }
                              />
                              <IconButton
                                onClick={() => {
                                  if (step.stepNumber === 0) {
                                    setNumDividers(numDividers - 1);
                                  } else {
                                    values.steps.forEach((step) => {
                                      if (
                                        step.stepNumber > 0 &&
                                        values.steps.indexOf(step) > index
                                      ) {
                                        step.stepNumber -= 1;
                                      }
                                    });
                                  }
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
                <div className="spaced-apart">
                  <div>
                    <Button
                      variant="contained"
                      disabled={!isValid || isSubmitting}
                      onClick={submitForm}
                    >
                      {id ? "Save" : "Submit"}
                    </Button>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {isSubmitting && (
                      <LinearProgress color="primary" sx={{ width: "90%" }} />
                    )}
                  </div>
                  <div>
                    <Button
                      variant="outlined"
                      onClick={() => saveDraft({ ...values, tags: editTags })}
                      disabled={values === EmptyRecipe}
                    >
                      Save Draft
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddRecipe;
