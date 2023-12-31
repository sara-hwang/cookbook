import {
  Autocomplete,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { Field, FieldArrayRenderProps, FormikErrors } from "formik";
import {
  FdcFoodItem,
  Ingredient,
  Recipe,
  UnitMenuItem,
} from "../constants/types";
import { Delete, Link, MoveUp } from "@mui/icons-material";
import "../stylesheets/AddRecipe.css";
import { useEffect, useState } from "react";
import { getIngredientSearch } from "../api";

interface AddIngredientRowProps {
  arrayHelpers: FieldArrayRenderProps;
  errors: FormikErrors<Recipe>;
  fdcMode: boolean;
  index: number;
  ingredient: Ingredient;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<Recipe>>;
  values: Recipe;
}
const AddIngredientRow = ({
  arrayHelpers,
  errors,
  fdcMode,
  index,
  ingredient,
  setFieldValue,
  values,
}: AddIngredientRowProps) => {
  const [suggestions, setSuggestions] = useState<
    { query: string; fdcId: string }[]
  >([]);
  const [apiQuery, setApiQuery] = useState<string>("");

  useEffect(() => {
    const queryIngredient = async () => {
      if (apiQuery) {
        const resp = await getIngredientSearch(apiQuery);
        setSuggestions(
          resp?.data.foods.map((entry: FdcFoodItem) => {
            return { query: entry.description, fdcId: entry.fdcId };
          })
        );
      }
    };

    queryIngredient();
  }, [apiQuery]);

  return (
    <Grid item container xs={12} spacing={1}>
      {!ingredient.isDivider &&
        (fdcMode ? (
          <Grid item container xs={6} direction="row">
            <Grid item>
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
            <Grid item xs>
              <Autocomplete
                freeSolo
                size="small"
                value={values.ingredients[index].fdcQuery}
                options={suggestions}
                getOptionLabel={(option) => {
                  if (typeof option === "object") return option.query;
                  return option;
                }}
                onChange={(e, value) => {
                  if (typeof value === "object" && value?.fdcId) {
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
          </Grid>
        ) : (
          <>
            <Grid item>
              <Field
                name={`ingredients.${index}.amount`}
                type="number"
                as={TextField}
                placeholder="Amount *"
                size="small"
                className="ingredient-amount-text-field"
                InputProps={{ inputProps: { min: "0", step: "any" } }}
                error={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>)
                    .amount !== undefined
                }
                helperText={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>).amount
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
                InputLabelProps={{ shrink: false }}
                error={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>)
                    .unit !== undefined
                }
                helperText={
                  errors.ingredients &&
                  errors.ingredients[index] &&
                  (errors.ingredients[index] as FormikErrors<Ingredient>).unit
                }
              >
                {Object.values(UnitMenuItem)
                  .filter((unitMenuItem) => typeof unitMenuItem == "string")
                  .map((unitMenuItem) => (
                    <MenuItem key={unitMenuItem} value={unitMenuItem}>
                      {unitMenuItem}
                    </MenuItem>
                  ))}
              </Field>
            </Grid>
          </>
        ))}
      <Grid item xs>
        <Field
          name={`ingredients.${index}.element`}
          as={TextField}
          placeholder={ingredient.isDivider ? "Section name *" : "Ingredient *"}
          size="small"
          fullWidth
          error={
            errors.ingredients &&
            errors.ingredients[index] &&
            (errors.ingredients[index] as FormikErrors<Ingredient>).element !==
              undefined
          }
          helperText={
            errors.ingredients &&
            errors.ingredients[index] &&
            (errors.ingredients[index] as FormikErrors<Ingredient>).element
          }
        />
      </Grid>
      <Grid item>
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
      <Grid item>
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
