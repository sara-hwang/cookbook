import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { Field, FieldArrayRenderProps, FormikErrors } from "formik";
import { Ingredient, Nutrient, Recipe } from "../../../utils/types";
import { Delete, Link, MoveUp } from "@mui/icons-material";
import "./AddRecipe.css";
import { useEffect, useState } from "react";
import {
  addCustomIngredient,
  getFdcUnits,
  getIngredientSearch,
  getFdcIngredient,
  searchCustomIngredients,
} from "../../../utils/api";

interface AddIngredientRowProps {
  arrayHelpers: FieldArrayRenderProps;
  errors: FormikErrors<Recipe>;
  index: number;
  ingredient: Ingredient;
  setFieldValue: (
    field: string,
    value: number | string,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<Recipe>>;
  values: Recipe;
}

const nutrientFields = [
  { key: "calories", label: "Calories (kcal)", id: 1008, unit: "kcal" },
  { key: "protein", label: "Protein (g)", id: 1003, unit: "g" },
  { key: "fat", label: "Fat (g)", id: 1004, unit: "g" },
  { key: "carbs", label: "Carbs (g)", id: 1005, unit: "g" },
  { key: "fiber", label: "Fiber (g)", id: 1079, unit: "g" },
  { key: "sugar", label: "Sugar (g)", id: 2000, unit: "g" },
  { key: "calcium", label: "Calcium (mg)", id: 1087, unit: "mg" },
  { key: "iron", label: "Iron (mg)", id: 1089, unit: "mg" },
  { key: "sodium", label: "Sodium (mg)", id: 1093, unit: "mg" },
  { key: "cholesterol", label: "Cholesterol (mg)", id: 1253, unit: "mg" },
  { key: "transFat", label: "Trans fat (g)", id: 1257, unit: "g" },
  { key: "saturatedFat", label: "Saturated fat (g)", id: 1258, unit: "g" },
];

const defaultCustomNutrition: Record<string, string> = {
  calories: "",
  protein: "",
  fat: "",
  carbs: "",
  fiber: "",
  sugar: "",
  calcium: "",
  iron: "",
  sodium: "",
  cholesterol: "",
  transFat: "",
  saturatedFat: "",
};

const AddIngredientRow = ({
  arrayHelpers,
  errors,
  index,
  ingredient,
  setFieldValue,
  values,
}: AddIngredientRowProps) => {
  const [suggestions, setSuggestions] = useState<
    { query: string; fdcId: number }[]
  >([]);
  const [fdcUnitMenuItem, setFdcUnitMenuItem] = useState<string[]>([]);
  const [apiQuery, setApiQuery] = useState<string>("");
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customServingGrams, setCustomServingGrams] = useState("");
  const [customNutrition, setCustomNutrition] = useState<
    Record<string, string>
  >(defaultCustomNutrition);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      if (!apiQuery) {
        setSuggestions([]);
        return;
      }

      const [fdcResp, customResp] = await Promise.all([
        getIngredientSearch(apiQuery, signal),
        searchCustomIngredients(apiQuery),
      ]);

      const fdcOptions = (fdcResp?.data?.foods ?? []).map(
        (entry: { description: string; fdcId: number }) => ({
          query: entry.description,
          fdcId: entry.fdcId,
        })
      );
      const customOptions = (customResp?.data ?? []).map(
        (entry: { query: string; fdcId: number }) => ({
          query: entry.query,
          fdcId: entry.fdcId,
        })
      );

      setSuggestions([...fdcOptions, ...customOptions]);
    })();

    return () => {
      controller.abort();
    };
  }, [apiQuery]);

  useEffect(() => {
    if (ingredient.fdcId && ingredient.fdcId > 0) {
      getUnitMenuItems(ingredient.fdcId);
      return;
    }
    if (ingredient.fdcId) {
      setFdcUnitMenuItem(["g"]);
    }
  }, [ingredient.fdcId]);

  const getUnitMenuItems = async (fdcId: number) => {
    const unitMenuItems = await getFdcUnits(fdcId);
    if (!unitMenuItems) return;
    setFdcUnitMenuItem(["g", ...unitMenuItems]);
  };

  const handleCustomIngredientSubmit = async () => {
    const trimmedName = customName.trim();
    if (!trimmedName) {
      alert("Please add a name for your ingredient.");
      return;
    }

    const servingGrams = parseFloat(customServingGrams);
    if (!customServingGrams || isNaN(servingGrams) || servingGrams <= 0) {
      alert("Please specify the serving size in grams.");
      return;
    }

    const nutrition = nutrientFields
      .filter((field) => customNutrition[field.key] !== "")
      .map((field) => ({
        name: field.label,
        id: field.id,
        amount: parseFloat(customNutrition[field.key]),
        unit: field.unit,
      }));

    if (!nutrition.length) {
      alert(
        "Add at least one nutrient value before saving your custom ingredient."
      );
      return;
    }

    const currentFdcId = values.ingredients[index]?.fdcId;
    const response = await addCustomIngredient({
      name: trimmedName,
      category: "Custom",
      fdcId: currentFdcId && currentFdcId < 0 ? currentFdcId : undefined,
      nutrition,
      portions: [
        {
          gramWeight: servingGrams,
          amount: servingGrams,
          unit: "g",
        },
      ],
    });

    if (!response || response.status !== 200) {
      alert(
        response?.data?.message ||
          response?.data ||
          "Could not save ingredient."
      );
      return;
    }

    const savedIngredient = response.data;
    const servingUnitLabel = `${servingGrams} g`;
    setFieldValue(
      `ingredients.${index}.fdcQuery`,
      savedIngredient.name || trimmedName
    );
    setFieldValue(`ingredients.${index}.fdcId`, savedIngredient.fdcId);
    setFieldValue(`ingredients.${index}.fdcUnit`, servingUnitLabel);
    setFieldValue(`ingredients.${index}.fdcAmount`, 1);
    setFdcUnitMenuItem([servingUnitLabel, "g"]);

    setCustomDialogOpen(false);
  };

  const handleOpenCustomDialog = async () => {
    const currentFdcId = values.ingredients[index]?.fdcId;
    // If there's a custom ingredient already selected (negative ID), load its values
    if (currentFdcId && currentFdcId < 0) {
      const response = await getFdcIngredient(currentFdcId);
      if (response?.data) {
        const ing = response.data;
        setCustomName(ing.name || "");
        setCustomServingGrams(ing.portions?.[0]?.gramWeight?.toString() || "");
        // Populate nutrition values
        const nutritionMap: Record<string, string> = {
          ...defaultCustomNutrition,
        };
        ing.nutrition?.forEach((n: Nutrient) => {
          const field = nutrientFields.find((f) => f.id === n.id);
          if (field) {
            nutritionMap[field.key] = n.amount.toString();
          }
        });
        setCustomNutrition(nutritionMap);
      }
    }
    setCustomDialogOpen(true);
  };

  const handleCloseCustomDialog = () => {
    setCustomDialogOpen(false);
    setCustomName("");
    setCustomServingGrams("");
    setCustomNutrition(defaultCustomNutrition);
  };

  const ingredientFdcId = values.ingredients[index]?.fdcId;

  return (
    <>
      <Grid container spacing={1} size={12}>
        {!ingredient.isDivider && (
          <Grid>
            <a
              href={
                ingredientFdcId && ingredientFdcId > 0
                  ? `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${ingredientFdcId}/nutrients`
                  : undefined
              }
            >
              <IconButton
                disableRipple
                disabled={!ingredientFdcId || ingredientFdcId < 0}
              >
                <Link />
              </IconButton>
            </a>
          </Grid>
        )}
        <Grid size="grow">
          <Field
            name={`ingredients.${index}.text`}
            as={TextField}
            placeholder={
              ingredient.isDivider ? "Section name *" : "Ingredient *"
            }
            size="small"
            fullWidth
            error={
              errors.ingredients &&
              errors.ingredients[index] &&
              (errors.ingredients[index] as FormikErrors<Ingredient>).text !==
                undefined
            }
            helperText={
              errors.ingredients &&
              errors.ingredients[index] &&
              (errors.ingredients[index] as FormikErrors<Ingredient>).text
            }
          />
        </Grid>
        {!ingredient.isDivider && (
          <Grid container direction="row" spacing={1} size={7}>
            <Grid size="grow">
              <Autocomplete
                freeSolo
                size="small"
                value={values.ingredients[index].fdcQuery ?? ""}
                options={suggestions}
                getOptionLabel={(option) => {
                  if (typeof option === "object") return option.query;
                  return option;
                }}
                onChange={(e, value) => {
                  if (typeof value === "object" && value?.fdcId) {
                    const isCustomIngredient = value.fdcId < 0;
                    setFieldValue(
                      `ingredients.${index}.fdcQuery`,
                      value?.query
                    );
                    setFieldValue(`ingredients.${index}.fdcId`, value?.fdcId);
                    setFieldValue(
                      `ingredients.${index}.fdcUnit`,
                      isCustomIngredient ? "g" : (ingredient.fdcUnit ?? "")
                    );
                    setFieldValue(
                      `ingredients.${index}.text`,
                      isCustomIngredient
                        ? value.query
                        : values.ingredients[index].text
                    );
                    if (isCustomIngredient) {
                      setFdcUnitMenuItem(["g"]);
                      setFieldValue(`ingredients.${index}.fdcAmount`, 100);
                    }
                    return;
                  }

                  setFieldValue(`ingredients.${index}.fdcQuery`, "");
                  setFieldValue(`ingredients.${index}.fdcId`, undefined as any);
                  setFieldValue(
                    `ingredients.${index}.fdcUnit`,
                    undefined as any
                  );
                  setFieldValue(
                    `ingredients.${index}.fdcAmount`,
                    undefined as any
                  );
                  setFdcUnitMenuItem([]);
                }}
                onInputChange={(e, value) => {
                  if (!value) {
                    setApiQuery("");
                    setFieldValue(`ingredients.${index}.fdcQuery`, "");
                    setFieldValue(
                      `ingredients.${index}.fdcId`,
                      undefined as any
                    );
                    setFieldValue(
                      `ingredients.${index}.fdcUnit`,
                      undefined as any
                    );
                    setFieldValue(
                      `ingredients.${index}.fdcAmount`,
                      undefined as any
                    );
                    setFdcUnitMenuItem([]);
                    return;
                  }
                  setApiQuery(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search for your ingredient..."
                    InputLabelProps={{ shrink: false }}
                    onChange={(e) => setApiQuery(e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid>
              <Field
                name={`ingredients.${index}.fdcAmount`}
                type="number"
                as={TextField}
                placeholder="Amount *"
                value={ingredient.fdcAmount ?? ""}
                size="small"
                className="ingredient-amount-text-field"
                InputProps={{ inputProps: { min: "0", step: "any" } }}
                error={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>)
                    .fdcAmount !== undefined
                }
                helperText={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>)
                    .fdcAmount
                }
              />
            </Grid>
            <Grid>
              <Field
                name={`ingredients.${index}.fdcUnit`}
                type="number"
                as={TextField}
                select
                value={
                  fdcUnitMenuItem.length > 0 && ingredient.fdcUnit
                    ? ingredient.fdcUnit
                    : ""
                }
                size="small"
                label={!ingredient ? "Unit *" : ""}
                className="ingredient-unit-select-field"
                InputLabelProps={{ shrink: false }}
                error={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>)
                    .fdcUnit !== undefined
                }
                helperText={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>)
                    .fdcUnit
                }
              >
                {fdcUnitMenuItem.map((unitMenuItem) => (
                  <MenuItem key={unitMenuItem} value={unitMenuItem}>
                    {unitMenuItem}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            <Grid>
              <Button
                size="small"
                variant="outlined"
                onClick={handleOpenCustomDialog}
              >
                Custom
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid>
          {values.ingredients.length > 1 && (
            <IconButton
              onClick={() =>
                arrayHelpers.swap(
                  index,
                  index ? index - 1 : values.ingredients.length - 1
                )
              }
              disableRipple
              className="move-up-button"
            >
              <MoveUp />
            </IconButton>
          )}
        </Grid>
        <Grid>
          <IconButton
            onClick={() => arrayHelpers.remove(index)}
            disableRipple
            className="delete-element-button"
          >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>

      <Dialog
        open={customDialogOpen}
        onClose={handleCloseCustomDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add custom ingredient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ingredient name"
            fullWidth
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
          />

          <TextField
            margin="dense"
            label="Serving size in grams"
            type="number"
            fullWidth
            value={customServingGrams}
            onChange={(event) => setCustomServingGrams(event.target.value)}
            InputProps={{ inputProps: { step: "any", min: 0 } }}
          />

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {nutrientFields.map((field) => (
              <Grid key={field.key} size={6}>
                <TextField
                  label={field.label}
                  type="number"
                  fullWidth
                  value={customNutrition[field.key]}
                  onChange={(event) =>
                    setCustomNutrition((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                  InputProps={{ inputProps: { min: 0, step: "any" } }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomDialog}>Cancel</Button>
          <Button onClick={handleCustomIngredientSubmit} variant="contained">
            Save ingredient
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddIngredientRow;
