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
    </Dialog>
  );
};

export default AddMealDialog;
