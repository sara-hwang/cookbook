import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import {
  EmptyRecipe,
  Ingredient,
  Recipe,
  UnitMenuItem,
} from "../constants/types";
import { Add } from "@mui/icons-material";
import {
  addRecipe,
  deleteRecipe,
  addFdcIngredient,
  updateRecipe,
  upload,
} from "../api";
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
import AddIngredientRow from "./AddIngredientRow";
import AddStepRow from "./AddStepRow";
import { popTab } from "../redux/tabsList";

const AddRecipe = () => {
  const draft = useAppSelector((state: RootState) => state.recipeDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File>();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Recipe>(EmptyRecipe);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [fdcMode, setFdcMode] = useState(false);
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
          ingredients: data.ingredients,
        };
        data.ingredients.forEach(
          async (ing) => await addFdcIngredient(ing.fdcId)
        );
        let response;
        if (id === undefined) {
          response = await addRecipe(data);
        } else {
          if (initialValues.key !== key) {
            response = await deleteRecipe(initialValues.key);
            if (response && response.status === 200) {
              dispatch(popTab(`/view/${id}`));
              data.dateAdded = initialValues.dateAdded;
              response = await addRecipe(data);
            } else {
              alert(response?.data);
            }
          } else response = await updateRecipe(data);
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
                  error={errors.title !== undefined}
                  helperText={errors.title}
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
                              amount: "",
                              unit: "",
                              element: "",
                              fdcQuery: "",
                              fdcId: "",
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
                              element: "",
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
                              let unit = "";
                              Object.entries(UnitMenuItem).forEach(
                                ([key, value]) => {
                                  if (
                                    value.some(
                                      (val) => val === words[1].toLowerCase()
                                    )
                                  )
                                    unit = key;
                                }
                              );
                              arrayHelpers.push({
                                isDivider: false,
                                amount: Number.isNaN(+words[0])
                                  ? words[0].includes("/")
                                    ? eval("" + words[0])
                                    : ""
                                  : words[0],
                                unit: unit,
                                element: words.splice(unit ? 2 : 1).join(" "),
                              });
                            });
                            setPopupOpen(true);
                          }}
                        >
                          Bulk Entry
                        </Button>
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Switch
                              disableRipple
                              onChange={(e) => setFdcMode(e.target.checked)}
                            />
                          }
                          label="Edit FDC Info"
                        />
                      </Grid>
                    </Grid>
                    {values.ingredients?.map(
                      (ingredient: Ingredient, index) => (
                        <AddIngredientRow
                          key={index}
                          arrayHelpers={arrayHelpers}
                          errors={errors}
                          fdcMode={fdcMode}
                          index={index}
                          ingredient={ingredient}
                          setFieldValue={setFieldValue}
                          values={values}
                        />
                      )
                    )}
                  </>
                )}
              </FieldArray>
              <FieldArray name="steps">
                {(arrayHelpers) => {
                  let currStep = 0;
                  return (
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
                                text: "",
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
                                text: "",
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
                        if (!step.isDivider) currStep++;
                        return (
                          <AddStepRow
                            key={index}
                            arrayHelpers={arrayHelpers}
                            currStep={currStep}
                            errors={errors}
                            index={index}
                            step={step}
                            values={values}
                          />
                        );
                      })}
                    </>
                  );
                }}
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
                      getTagProps={getTagProps}
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
