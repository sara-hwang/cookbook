import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
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
  UnitMenuItem,
} from "../constants/types";
import { Add, Delete } from "@mui/icons-material";
import { addRecipe, updateRecipe, upload } from "../api";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { setRecipeDraft } from "../redux/recipeDraft";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import UploadImage from "../components/UploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTags, getRecipeDetails } from "../helpers";
import "../stylesheets/AddRecipe.css";
import { setRecipesList } from "../redux/recipesList";
import ChipDisplay from "../components/ChipDisplay";
import BulkEntryDialog from "./BulkEntryDialog";

const AddRecipe = () => {
  const draft = useAppSelector((state: RootState) => state.recipeDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File>();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Recipe>(EmptyRecipe);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [bulkEntryType, setBulkEntryType] = useState<"ingredient" | "step">(
    "ingredient"
  );
  const [handleTokens, sethandleTokens] = useState(() => (token: string) => {
    return;
  });

  useEffect(() => {
    const initTags = async () => {
      setAllTags(await getAllTags());
    };
    initTags();
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      getRecipeDetails(id, setInitialValues);
    } else {
      setInitialValues(draft);
    }
  }, [id]);

  const validationSchema = yup.object({
    title: yup.string().required("Required").max(250),
    servings: yup.number().required("Required").min(0),
    ingredients: yup.array().of(
      yup.object().shape({
        isDivider: yup.boolean().required("Required"),
        amount: yup.number().when(["isDivider"], {
          is: false,
          then: (schema) =>
            schema.required("Required").min(0, "Must be at least 0"),
        }),
        unit: yup.string().when(["isDivider"], {
          is: false,
          then: (schema) => schema.required("Required"),
        }),
        element: yup.string().required("Required"),
      })
    ),
    steps: yup.array().of(
      yup.object().shape({
        text: yup.string().required("Required"),
      })
    ),
  });

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
      canvas.width = Math.min(img.width, 500);
      canvas.height = canvas.width / aspectRatio;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), "image/jpeg", 0.2);
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
      onSubmit={async (data: Recipe, { resetForm }) => {
        const images = await handlePhotoField();
        const key = slugify(data.title, { lower: true });
        data = {
          ...data,
          key: key,
          photo: images?.original,
          thumbnail: images?.thumbnail,
        };
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
      {({
        values,
        errors,
        isValid,
        isSubmitting,
        setFieldValue,
        submitForm,
      }) => (
        <Form>
          <Box sx={{ display: "flex", padding: "24px" }}>
            <BulkEntryDialog
              type={bulkEntryType}
              popupOpen={popupOpen}
              setPopupOpen={setPopupOpen}
              handleTokens={handleTokens}
            />
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
              <FieldArray name="ingredients">
                {(arrayHelpers) => (
                  <>
                    <Grid
                      item
                      container
                      xs={12}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="h6">Ingredients</Typography>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => {
                            arrayHelpers.push({
                              isDivider: false,
                            });
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            arrayHelpers.push({
                              isDivider: true,
                            });
                          }}
                        >
                          Add Divider
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setBulkEntryType("ingredient");
                            sethandleTokens(() => (token: string) => {
                              const words = token.split(" ");
                              words.length === 1;
                              arrayHelpers.push({
                                isDivider: false,
                                amount: Number.isNaN(+words[0])
                                  ? words[0].includes("/")
                                    ? eval("" + words[0])
                                    : ""
                                  : words[0],
                                unit: words[1] in UnitMenuItem ? words[1] : "",
                                element: words
                                  .splice(words[1] in UnitMenuItem ? 2 : 1)
                                  .join(" "),
                              });
                            });
                            setPopupOpen(true);
                          }}
                        >
                          Bulk Entry
                        </Button>
                      </Grid>
                    </Grid>
                    {values.ingredients?.map(
                      (ingredient: Ingredient, index) => {
                        return (
                          <Grid item container key={index} xs={12} spacing={1}>
                            {!ingredient.isDivider && (
                              <>
                                <Grid item>
                                  <Field
                                    name={`ingredients.${index}.amount`}
                                    type="number"
                                    as={TextField}
                                    placeholder="Amount *"
                                    size="small"
                                    className="ingredient-amount-text-field"
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
                                </Grid>
                                <Grid item>
                                  <Field
                                    name={`ingredients.${index}.unit`}
                                    type="number"
                                    as={TextField}
                                    select
                                    size="small"
                                    label={!ingredient.unit ? "Unit *" : ""}
                                    className="ingredient-unit-select-field"
                                    InputLabelProps={{
                                      shrink: false,
                                    }}
                                    error={
                                      errors.ingredients &&
                                      errors.ingredients[index] &&
                                      (
                                        errors.ingredients[
                                          index
                                        ] as FormikErrors<Ingredient>
                                      ).unit !== undefined
                                    }
                                    helperText={
                                      errors.ingredients &&
                                      errors.ingredients[index] &&
                                      (
                                        errors.ingredients[
                                          index
                                        ] as FormikErrors<Ingredient>
                                      ).unit
                                    }
                                  >
                                    {Object.values(UnitMenuItem)
                                      .filter(
                                        (unitMenuItem) =>
                                          typeof unitMenuItem == "string"
                                      )
                                      .map((unitMenuItem) => (
                                        <MenuItem
                                          key={unitMenuItem}
                                          value={unitMenuItem}
                                        >
                                          {unitMenuItem}
                                        </MenuItem>
                                      ))}
                                  </Field>
                                </Grid>
                              </>
                            )}
                            <Grid item xs>
                              <Field
                                name={`ingredients.${index}.element`}
                                as={TextField}
                                placeholder={
                                  ingredient.isDivider
                                    ? "Section name *"
                                    : "Ingredient *"
                                }
                                size="small"
                                fullWidth
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
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                                disableRipple
                                className="delete-element-button"
                              >
                                <Delete />
                              </IconButton>
                            </Grid>
                          </Grid>
                        );
                      }
                    )}
                  </>
                )}
              </FieldArray>
              <FieldArray name="steps">
                {(arrayHelpers) => (
                  <>
                    <Grid
                      item
                      container
                      xs={12}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="h6">Steps </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => {
                            arrayHelpers.push({
                              isDivider: false,
                            });
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            arrayHelpers.push({
                              isDivider: true,
                            });
                          }}
                        >
                          Add Divider
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setBulkEntryType("step");
                            sethandleTokens(() => (token: string) => {
                              arrayHelpers.push({
                                isDivider: false,
                                text: token,
                              });
                            });
                            setPopupOpen(true);
                          }}
                        >
                          Bulk Entry
                        </Button>
                      </Grid>
                    </Grid>
                    {values.steps?.map((step, index) => {
                      let numSteps = 1;
                      return (
                        <Grid item container xs={12} key={index} spacing={1}>
                          <Grid item>
                            <Typography key={index} variant="h6">
                              {!step.isDivider && numSteps++ + "."}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Field
                              name={`steps.${index}.text`}
                              placeholder={
                                step.isDivider
                                  ? "Section name..."
                                  : "Instructions..."
                              }
                              as={TextField}
                              size="small"
                              fullWidth
                              multiline={!step.isDivider ?? undefined}
                              rows={2}
                              error={
                                errors.steps &&
                                errors.steps[index] &&
                                (errors.steps[index] as FormikErrors<Step>)
                                  .text !== undefined
                              }
                              helperText={
                                errors.steps &&
                                errors.steps[index] &&
                                (errors.steps[index] as FormikErrors<Step>).text
                              }
                            />
                          </Grid>
                          <Grid item>
                            <IconButton
                              disableRipple
                              className="delete-element-button"
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </>
                )}
              </FieldArray>
              <Grid item xs={12}>
                <Typography variant="h6">Photo</Typography>
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
                <Autocomplete
                  multiple
                  freeSolo
                  options={allTags}
                  value={values.tags}
                  size="small"
                  renderTags={(value: readonly string[], getTagProps) => (
                    <ChipDisplay
                      tags={value}
                      size="small"
                      onChipDelete={getTagProps({ index: 0 }).onDelete}
                    />
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: false }}
                      placeholder="Press enter to add a tag"
                    />
                  )}
                  onChange={(e, value) => {
                    setFieldValue("tags", value);
                  }}
                />
              </Grid>
              <Grid item container justifyContent="flex-end" spacing={1}>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => saveDraft(values)}
                    disabled={values === EmptyRecipe}
                  >
                    Save Draft
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    disabled={!isValid || isSubmitting}
                    onClick={submitForm}
                    className="submit-button"
                  >
                    {isSubmitting && (
                      <CircularProgress color="primary" size={"1rem"} />
                    )}
                    {id ? "Save" : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddRecipe;
