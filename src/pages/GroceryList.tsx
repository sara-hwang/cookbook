import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { getGroceryList } from "../api";
import { Ingredient } from "../constants/types";
interface IProps {
  isGroceryOpen: boolean;
  setIsGroceryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GroceryList = ({ isGroceryOpen, setIsGroceryOpen }: IProps) => {
  const auth = useAuthUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [groceryList, setGroceryList] = useState<Ingredient[]>([]);

  useEffect(() => {
    const initGroceryList = async () => {
      const response = await getGroceryList(username);
      if (response && response.status === 200) {
        setGroceryList(response.data.grocery);
      } else {
        alert("Groceries returned " + response?.data + ", server may be down.");
      }
    };
    const username = auth()?.username;
    username && initGroceryList();
  }, [isGroceryOpen]);

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
        <Grid container spacing={2}>
          <>
            {groceryList.map(
              (groceryItem, index) =>
                groceryItem.unit && (
                  <Grid item key={index} xs={12}>
                    {groceryItem.amount}&nbsp;
                    {groceryItem.unit}&nbsp;
                    {groceryItem.element}
                  </Grid>
                ),
            )}
          </>
          {/* <Grid item>
            <Button variant="contained" type="submit">
              Send
            </Button>
          </Grid> */}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GroceryList;
