import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
interface AddMealDialogProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddMealDialog = ({
  dialogOpen,
  setDialogOpen,
}: AddMealDialogProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setErrorMessage("");
  }, [dialogOpen]);

  const validationSchema = yup.object({
    name: yup.string().required().max(50),
    food: yup.string().required().max(50),
    portion: yup.number().required(),
  });

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>
        Add Meal
        <IconButton
          disableRipple
          onClick={() => setDialogOpen(false)}
          sx={{ "&:hover": { color: "red" }, float: "right", padding: "0px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ name: "", password: "", portions: 1 }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (data: {
            name: string;
            password: string;
            portions: number;
          }) => {
            return true;
          }}
        >
          {({ errors, isValid, isSubmitting, dirty }) => (
            <Form>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Grid item sx={{ marginTop: "10px", width: "100%" }}>
                  <Field
                    name="meal name"
                    type="input"
                    as={Autocomplete}
                    label="Meal Name"
                    size="small"
                    error={errors.name !== undefined}
                    helperText={errors.name}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="recipe"
                    type={"input"}
                    as={TextField}
                    label="food"
                    size="small"
                    error={errors.password !== undefined}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px", width: "100%" }}>
                  <Field
                    name="portions"
                    type="number"
                    as={TextField}
                    label="Portions"
                    InputProps={{
                      inputProps: { min: "0", step: "any" },
                    }}
                    size="small"
                    error={errors.portions !== undefined}
                    helperText={errors.portions}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                {errorMessage && (
                  <Grid item xs={12} sx={{ color: "red" }}>
                    {errorMessage}
                  </Grid>
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    disabled={!dirty || !isValid || isSubmitting}
                    type="submit"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealDialog;
