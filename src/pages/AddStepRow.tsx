import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { Field, FieldArrayRenderProps, FormikErrors } from "formik";
import { Recipe, Step } from "../constants/types";
import { Delete, MoveUp } from "@mui/icons-material";
import "../stylesheets/AddRecipe.css";

interface AddStepRowProps {
  arrayHelpers: FieldArrayRenderProps;
  currStep: number;
  errors: FormikErrors<Recipe>;
  index: number;
  step: Step;
  values: Recipe;
}

const AddStepRow = ({
  arrayHelpers,
  currStep,
  errors,
  index,
  step,
  values,
}: AddStepRowProps) => {
  return (
    <Grid item container xs={12} spacing={1}>
      {!step.isDivider && (
        <Grid item>
          <Typography variant="h6">{currStep}.</Typography>
        </Grid>
      )}
      <Grid item xs>
        <Field
          name={`steps.${index}.text`}
          placeholder={step.isDivider ? "Section name..." : "Instructions..."}
          as={TextField}
          size="small"
          fullWidth
          multiline={!step.isDivider ?? undefined}
          rows={2}
          error={
            errors.steps &&
            errors.steps[index] &&
            (errors.steps[index] as FormikErrors<Step>).text !== undefined
          }
          helperText={
            errors.steps &&
            errors.steps[index] &&
            (errors.steps[index] as FormikErrors<Step>).text
          }
        />
      </Grid>
      <Grid item>
        {values.steps.length > 1 && (
          <IconButton
            onClick={() =>
              arrayHelpers.swap(
                index,
                index ? index - 1 : values.steps.length - 1
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
          disableRipple
          className="delete-element-button"
          onClick={() => arrayHelpers.remove(index)}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default AddStepRow;
