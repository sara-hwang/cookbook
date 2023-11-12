import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useSignIn } from "react-auth-kit";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
interface IProps {
  isGroceryOpen: boolean;
  setIsGroceryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GroceryList = ({ isGroceryOpen, setIsGroceryOpen }: IProps) => {
  const signIn = useSignIn();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    setErrorMessage("");
  }, [isGroceryOpen]);

  const validationSchema = yup.object({
    username: yup.string().required().max(50),
    password: yup.string().required().max(50),
  });

  return (
    <Dialog open={isGroceryOpen}>
      <DialogTitle>
        Grocery List
        <IconButton
          disableRipple
          onClick={() => {
            setIsGroceryOpen(false);
            if (pathname.startsWith("/add")) {
              navigate(-1);
            }
          }}
          sx={{ "&:hover": { color: "red" }, float: "right", padding: "0px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item sx={{ marginTop: "10px", width: "100%" }}></Grid>
          <Grid item xs={12}></Grid>

          <Grid item>
            <Button variant="contained" type="submit">
              Send
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GroceryList;
