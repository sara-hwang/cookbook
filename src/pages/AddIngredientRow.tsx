import { Grid, IconButton, MenuItem, TextField } from "@mui/material";
import { Field, FieldArrayRenderProps, FormikErrors } from "formik";
import { Ingredient, Recipe, UnitMenuItem } from "../constants/types";
import { Delete, MoveUp } from "@mui/icons-material";
import "../stylesheets/AddRecipe.css";

interface AddIngredientRowProps {
  arrayHelpers: FieldArrayRenderProps;
  errors: FormikErrors<Recipe>;
  index: number;
  ingredient: Ingredient;
  values: Recipe;
}
const AddIngredientRow = ({
  arrayHelpers,
  errors,
  index,
  ingredient,
  values,
}: AddIngredientRowProps) => {
  return (
    <Grid item container xs={12} spacing={1}>
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
                (errors.ingredients[index] as FormikErrors<Ingredient>).unit !==
                  undefined
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
      )}
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
