import {
  Autocomplete,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { Field, FieldArrayRenderProps, FormikErrors } from "formik";
import { Ingredient, Recipe } from "../../../utils/types";
import { Delete, Link, MoveUp } from "@mui/icons-material";
import "./AddRecipe.css";
import { useEffect, useState } from "react";
import { getFdcUnits, getIngredientSearch } from "../../../utils/api";

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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      if (!apiQuery) return;
      const resp = await getIngredientSearch(apiQuery, signal);
      if (!resp) return;
      setSuggestions(
        resp.data.foods.map((entry: { description: string; fdcId: number }) => {
          return { query: entry.description, fdcId: entry.fdcId };
        })
      );
    })();

    return () => {
      controller.abort();
    };
  }, [apiQuery]);

  useEffect(() => {
    ingredient.fdcId && getUnitMenuItems(ingredient.fdcId);
  }, [ingredient.fdcId]);

  const getUnitMenuItems = async (fdcId: number) => {
    const unitMenuItems = await getFdcUnits(fdcId);
    if (!unitMenuItems) return;
    setFdcUnitMenuItem(["g", ...unitMenuItems]);
  };

  return (
    <Grid container spacing={1} size={12}>
      {!ingredient.isDivider && (
        <Grid>
          <a
            href={
              values.ingredients[index].fdcId
                ? `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${values.ingredients[index].fdcId}/nutrients`
                : undefined
            }
          >
            <IconButton
              disableRipple
              disabled={!values.ingredients[index].fdcId}
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
          placeholder={ingredient.isDivider ? "Section name *" : "Ingredient *"}
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
                  setFieldValue(`ingredients.${index}.fdcQuery`, value?.query);
                  setFieldValue(`ingredients.${index}.fdcId`, value?.fdcId);
                }
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
                (errors.ingredients[index] as FormikErrors<Ingredient>).fdcUnit
              }
            >
              {fdcUnitMenuItem.map((unitMenuItem) => (
                <MenuItem key={unitMenuItem} value={unitMenuItem}>
                  {unitMenuItem}
                </MenuItem>
              ))}
            </Field>
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
  );
};

export default AddIngredientRow;
