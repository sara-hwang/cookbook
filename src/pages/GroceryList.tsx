import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import { getGroceryList, updateGroceryList } from "../api";
import { Ingredient } from "../constants/types";
import "../stylesheets/Grocery.css";
import "../stylesheets/App.css";

export const GroceryList = () => {
  const auth = useAuthUser();
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
  }, [pathname]);

  const update = async () => {
    if (!auth()?.username) {
      return;
    }
    const checkboxElement = document.getElementById("grocery-checklist");
    if (checkboxElement) {
      const items = groceryList.slice();
      const formData = new FormData(checkboxElement as HTMLFormElement);
      for (const [index, _] of formData.entries()) {
        if (+index > -1) {
          items.splice(+index, 1);
        }
      }
      updateGroceryList(auth()?.username, items);
      setGroceryList(items);
      (checkboxElement as HTMLFormElement).reset();
    }
  };

  return (
    <Box sx={{ display: "flex", padding: "24px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="h5">Grocery List</div>
        </Grid>
        <Grid item xs={12} sx={{ padding: "0 !important" }}>
          <form id="grocery-checklist">
            {groceryList.map((ing, index) => (
              <div
                key={index}
                className="grocery-list"
                style={{
                  width: "100%",
                  margin: "8px 0px 8px 40px",
                }}
              >
                <input
                  type="checkbox"
                  name={"" + index}
                  id={`grocery-checkbox-${index}`}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                />
                <label
                  htmlFor={`grocery-checkbox-${index}`}
                  style={{ fontSize: "large", textDecoration: "none" }}
                >
                  {ing.amount} {ing.unit} {ing.element}
                </label>
              </div>
            ))}
          </form>
        </Grid>
        <Grid item xs={12}>
          <div className="spaced-apart">
            <div>
              <Button variant="contained" onClick={update}>
                Update
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  updateGroceryList(auth()?.username, []);
                  setGroceryList([]);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GroceryList;
