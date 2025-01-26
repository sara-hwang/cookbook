import { Grid, IconButton, TextField, Typography } from "@mui/material";
import { Field, FieldArrayRenderProps, FormikErrors } from "formik";
import { Recipe, Step } from "../../../utils/types";
import { Delete, MoveUp } from "@mui/icons-material";
import "./AddRecipe.css";

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
    <Grid container spacing={1} size={12}>
      {!step.isDivider && (
        <Grid>
          <Typography variant="h6">{currStep}.</Typography>
        </Grid>
      )}
      <Grid size="grow">
        <Field
          name={`steps.${index}.text`}
          placeholder={step.isDivider ? "Section name..." : "Instructions..."}
          as={TextField}
          size="small"
          fullWidth
          multiline={!step.isDivider ?? undefined}
          minRows={2}
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
      <Grid>
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
      <Grid>
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
