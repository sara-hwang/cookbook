import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import {
  EmptyRecipe,
  Ingredient,
  IngredientPortion,
  Nutrient,
  NutritionalProfile,
  Recipe,
} from "../../../utils/types";
import { Add, Info } from "@mui/icons-material";
import {
  addRecipe,
  deleteRecipe,
  addFdcIngredient,
  updateRecipe,
  upload,
  getFdcIngredient,
} from "../../../utils/api";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { setRecipeDraft } from "../../../redux/recipeDraft";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import UploadImage from "./UploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTags, getRecipeDetails } from "../../../utils/helpers";
import "./AddRecipe.css";
import { setRecipesList } from "../../../redux/recipesList";
import ChipDisplay from "../../ChipDisplay";
import BulkEntryDialog from "./BulkEntryDialog";
import AddIngredientRow from "./AddIngredientRow";
import AddStepRow from "./AddStepRow";
import { popTab } from "../../../redux/tabsList";

const getNutritionalValues = async (
  ingredients: Ingredient[]
): Promise<NutritionalProfile> => {
  const nutritionObj: NutritionalProfile = {
    _1008: 0,
    _1003: 0,
    _1004: 0,
    _1005: 0,
    _1079: 0,
    _2000: 0,
    _1087: 0,
    _1089: 0,
    _1093: 0,
    _1258: 0,
    _1253: 0,
    _1257: 0,
  };
  for (const [index, ing] of ingredients.entries()) {
    // get ingredient nutritional profile, continue if none
    const response = await getFdcIngredient(ing.fdcId);
    if (
      !response ||
      response.status != 200 ||
      !response.data ||
      !response.data.nutrition
    )
      continue;
    response.data.nutrition.forEach((nutrient: Nutrient) => {
      let amountInGrams = ing.fdcAmount ?? 0;
      if (ing.fdcUnit !== "g") {
        const currUnit = response.data.portions.find(
          (portion: IngredientPortion) =>
            `${portion.amount} ${portion.unit}` === ing.fdcUnit
        );
        if (!currUnit || !ing.fdcAmount) return;
        amountInGrams = currUnit.gramWeight * ing.fdcAmount;
      }
      const key = ("_" + nutrient.id) as keyof typeof nutritionObj;
      nutritionObj[key] +=
        ((amountInGrams / 100) * nutrient.amount) /
        (nutrient.unit === "g" || nutrient.unit === "kcal" ? 1 : 1000);
    });
  }

  return nutritionObj;
};

const AddRecipe = () => {
  const draft = useAppSelector((state: RootState) => state.recipeDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File>();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Recipe>(EmptyRecipe);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [ingPopupOpen, setIngPopupOpen] = useState(false);
  const [stepPopupOpen, setStepPopupOpen] = useState(false);
  const [bulkEntryType, setBulkEntryType] = useState<"ingredient" | "step">(
    "ingredient"
  );

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
        text: yup.string().required("Required"),
        fdcAmount: yup.number().when(["isDivider"], {
          is: false,
          then: (schema) => schema.min(0, "Must be at least 0"),
        }),
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
          photo: !images
            ? initialValues.photo
            : [images.original].concat(initialValues.photo),
          thumbnail: images?.thumbnail,
          ingredients: data.ingredients,
        };
        data.ingredients.forEach(
          async (ing) => await addFdcIngredient(ing.fdcId)
        );
        data.nutritionalValues = await getNutritionalValues(data.ingredients);
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
            <Grid container spacing={2}>
              <Grid size={12}>
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
              <Grid
                size={{
                  xs: 12,
                  md: 9
                }}>
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
              <Grid container direction={"row"} spacing={2}>
                <Grid>
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
                <Grid>
                  <Field
                    placeholder="eg. 2 cookies (100 g)"
                    name="servingDescription"
                    type="input"
                    as={TextField}
                    label="Serving description"
                    size="small"
                  />
                </Grid>
              </Grid>
              <FieldArray name="ingredients">
                {(arrayHelpers) => (
                  <>
                    <BulkEntryDialog
                      type={bulkEntryType}
                      popupOpen={ingPopupOpen}
                      setPopupOpen={setIngPopupOpen}
                      arrayHelpers={arrayHelpers}
                    />
                    <Grid container spacing={1} direction="row" alignItems="center" size={12}>
                      <Grid>
                        <Typography variant="h6">Ingredients</Typography>
                      </Grid>
                      <Grid>
                        <Tooltip
                          title={
                            <div className="preserve-newlines">{`To link to other recipes, follow the format:\n[label](recipe-key)\nThe recipe key is whatever follows "/view/" in the URL\n\nFor example:\n[Couscous salad](greek-couscous-salad)\n\n(not supported for dividers)`}</div>
                          }
                          arrow
                        >
                          <div style={{ height: "20px" }}>
                            <Info fontSize="small" />
                          </div>
                        </Tooltip>
                      </Grid>
                      <Grid>
                        <IconButton
                          onClick={() => {
                            arrayHelpers.push({
                              isDivider: false,
                              text: "",
                              fdcQuery: "",
                              fdcId: undefined,
                              fdcUnit: undefined,
                              fdcAmount: undefined,
                            });
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Grid>
                      <Grid>
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
                      <Grid>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setBulkEntryType("ingredient");
                            setIngPopupOpen(true);
                          }}
                        >
                          Bulk Entry
                        </Button>
                      </Grid>
                    </Grid>
                    {values.ingredients?.map(
                      (ingredient: Ingredient, index) => (
                        <AddIngredientRow
                          key={index}
                          arrayHelpers={arrayHelpers}
                          errors={errors}
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
                      <BulkEntryDialog
                        type={bulkEntryType}
                        popupOpen={stepPopupOpen}
                        setPopupOpen={setStepPopupOpen}
                        arrayHelpers={arrayHelpers}
                      />
                      <Grid container spacing={1} direction="row" alignItems="center" size={12}>
                        <Grid>
                          <Typography variant="h6">Steps </Typography>
                        </Grid>
                        <Grid>
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
                        <Grid>
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
                        <Grid>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setBulkEntryType("step");
                              setStepPopupOpen(true);
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
              <Grid size={12}>
                <Typography variant="h6">Photo</Typography>
                <Field
                  name="photo"
                  type="input"
                  as={UploadImage}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 9
                }}>
                <Typography variant="h6">{`Chef's Notes`}</Typography>
                <Field
                  name="notes"
                  type="input"
                  as={TextField}
                  fullWidth
                  multiline
                  size="small"
                  minRows={3}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 9
                }}>
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
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid>
                  <Button
                    variant="outlined"
                    onClick={() => saveDraft(values)}
                    disabled={values === EmptyRecipe}
                  >
                    Save Draft
                  </Button>
                </Grid>
                <Grid>
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
