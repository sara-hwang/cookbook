import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { getRecipesList } from "../../utils/helpers";

interface AddMealDialogProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const extractDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const AddMealDialog = ({
  dialogOpen,
  setDialogOpen,
}: AddMealDialogProps) => {
  const [recipeTitles, setRecipeTitles] = useState<
    { label: string; id: string }[]
  >([]);
  let { recipesList } = useAppSelector((state: RootState) => state.recipesList);

  useEffect(() => {
    const generateRecipeTitles = async () => {
      if (!recipesList || recipesList.length == 0) {
        recipesList = await getRecipesList();
      }
      setRecipeTitles(
        recipesList.map((recipe) => {
          return { label: recipe.title, id: recipe.key };
        })
      );
    };
    generateRecipeTitles();
  }, []);

  const validationSchema = yup.object({
    date: yup.string().required("Required"),
    mealName: yup.string().required("Required").max(50),
    recipe: yup.string().required("Required").max(500),
    portions: yup.number().required("Required").min(0),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            initialValues={{
              date: new Date(),
              mealName: "",
              recipe: "",
              portions: 1,
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (data: {
              date: Date;
              mealName: string;
              recipe: string;
              portions: number;
            }) => {
              console.log(data);
            }}
          >
            {({
              dirty,
              errors,
              isValid,
              isSubmitting,
              setFieldValue,
              submitForm,
            }) => (
              <Form>
                <Grid
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid sx={{ marginTop: "10px", width: "100%" }}>
                    <Field
                      name="date"
                      type="input"
                      as={DatePicker}
                      label="Date"
                      size="small"
                      error={errors.date !== undefined}
                      helperText={errors.date}
                      sx={{ width: "100%" }}
                      onChange={(value: Date) => {
                        setFieldValue("date", extractDate(value));
                      }}
                    />
                  </Grid>
                  <Grid sx={{ marginTop: "10px", width: "100%" }}>
                    <Field
                      name="mealName"
                      type="input"
                      as={TextField}
                      label="Meal Name"
                      size="small"
                      error={errors.mealName !== undefined}
                      helperText={errors.mealName}
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid sx={{ marginTop: "10px", width: "100%" }}>
                    <Autocomplete
                      fullWidth
                      options={recipeTitles}
                      onChange={(e, value) => {
                        setFieldValue("recipe", value?.id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.recipe !== undefined}
                          helperText={errors.recipe}
                          size="small"
                          sx={{ backgroundColor: "white" }}
                          hiddenLabel
                          variant="outlined"
                          placeholder="Search for your recipe"
                        />
                      )}
                    />
                  </Grid>
                  <Grid sx={{ marginTop: "10px", width: "100%" }}>
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
                  <Grid>
                    <Button
                      variant="contained"
                      disabled={!dirty || !isValid || isSubmitting}
                      onClick={submitForm}
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
    </LocalizationProvider>
  );
};

export default AddMealDialog;
