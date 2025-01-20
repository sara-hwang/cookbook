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
    mealName: yup.string().required("Required").max(50),
    recipe: yup.string().required("Required").max(500),
    portions: yup.number().required("Required").min(0),
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
          initialValues={{ mealName: "", recipe: "", portions: 1 }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (data: {
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
                <Grid item sx={{ marginTop: "10px", width: "100%" }}>
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
                <Grid item sx={{ marginTop: "10px", width: "100%" }}>
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
                <Grid item>
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
  );
};

export default AddMealDialog;
