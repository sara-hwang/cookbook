import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "../SearchBar";
import { Recipe } from "../../utils/types";
import { getRecipesList } from "../../utils/helpers";

interface IProps {
  isAddOpen: boolean;
  setIsAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddMealDialog = ({ isAddOpen, setIsAddOpen }: IProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [mealPrepRecipes, setMealPrepRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const initMealPrep = async () => {
      if (!isAddOpen) return;
      const recipes = await getRecipesList();
      setMealPrepRecipes(recipes);
    };

    setErrorMessage("Fill in all fields");
    initMealPrep();
  }, [isAddOpen]);

  const validationSchema = yup.object({
    recipe: yup.string().required().max(50),
    meal: yup.string().required().max(50),
    servings: yup.number().required().max(50),
    date: yup.string().required().max(50),
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={isAddOpen}>
      <DialogTitle>
        Add Meal
        <IconButton
          disableRipple
          onClick={() => setIsAddOpen(false)}
          sx={{ "&:hover": { color: "red" }, float: "right", padding: "0px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ recipe: "", meal: "", servings: 1, date: "" }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (data: {
            recipe: string;
            meal: string;
            servings: number;
            date: string;
          }) => {
            console.log("todo");
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
                <Grid
                  item
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="flex-start"
                  spacing={3}
                >
                  <Grid
                    item
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    xs={6}
                    spacing={2}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{ marginTop: "10px", width: "100%" }}
                    >
                      <SearchBar />
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%" }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="meal-select-label">Meal</InputLabel>
                        <Field
                          name="meal"
                          type="input"
                          as={Select}
                          label="Meal"
                          labelId="meal-select-label"
                          error={errors.meal !== undefined}
                          helperText={errors.meal}
                        >
                          <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                          <MenuItem value={"lunch"}>Lunch</MenuItem>
                          <MenuItem value={"dinner"}>Dinner</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%" }}>
                      <Field
                        name="servings"
                        type="number"
                        as={TextField}
                        label="Servings"
                        size="small"
                        fullwidth
                        error={errors.servings !== undefined}
                        helperText={errors.servings}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%" }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="date-select-label">Date</InputLabel>
                        <Field
                          name="date"
                          type="input"
                          as={Select}
                          label="Date"
                          labelId="date-select-label"
                          error={errors.date !== undefined}
                          helperText={errors.date}
                        >
                          <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                          <MenuItem value={"lunch"}>Lunch</MenuItem>
                          <MenuItem value={"dinner"}>Dinner</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 300,
                        "& ul": { padding: 0 },
                      }}
                      subheader={<li />}
                    >
                      {mealPrepRecipes.map((recipe) => (
                        <ListItem key={recipe.key} disablePadding>
                          <ListItemButton>
                            <ListItemAvatar>
                              <Avatar
                                variant="square"
                                alt={recipe.title}
                                src={recipe.thumbnail}
                                sx={{
                                  width: 70,
                                  height: 70,
                                  marginRight: "10px",
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText primary={recipe.title} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
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
                    Add
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
