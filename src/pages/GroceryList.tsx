import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import { getFoodCategory, getGroceryList, updateGroceryList } from "../api";
import { Ingredient } from "../constants/types";
import "../stylesheets/Grocery.css";
import "../stylesheets/App.css";

export const GroceryList = () => {
  const auth = useAuthUser();
  const { pathname } = useLocation();
  const [groceryList, setGroceryList] = useState<Ingredient[]>([]);
  const [categorizedItems, setCategorizedItems] = useState<Ingredient[]>([]);

  useEffect(() => {
    const initGroceryList = async () => {
      const response = await getGroceryList(username);
      if (response && response.status === 200) {
        setGroceryList(
          response.data.grocery.sort((a: Ingredient, b: Ingredient) =>
            a.element.localeCompare(b.element)
          )
        );
      } else {
        alert("Groceries returned " + response?.data + ", server may be down.");
      }
    };
    const username = auth()?.username;
    username && initGroceryList();
  }, [pathname]);

  useEffect(() => {
    const categoryDict: { [categoryName: string]: Ingredient[] } = {};
    const categorizeGroceryList = async () => {
      for (const [index, _] of groceryList.entries()) {
        let response = await getFoodCategory(groceryList[index].fdcId);
        if (!response) response = "Other";
        if (response in categoryDict)
          categoryDict[response].push(groceryList[index]);
        else categoryDict[response] = [groceryList[index]];
        await new Promise((r) => setTimeout(r, 100));
      }
      const flatCategories: Ingredient[] = [];
      Object.keys(categoryDict).forEach((categoryName) => {
        flatCategories.push({ isDivider: true, element: categoryName });
        categoryDict[categoryName].forEach((ing) => flatCategories.push(ing));
      });
      setCategorizedItems(flatCategories);
    };

    categorizeGroceryList();
  }, [groceryList]);

  const update = async () => {
    const checkboxElement = document.getElementById("grocery-checklist");
    if (!checkboxElement || !auth()?.username) return;
    const formData = new FormData(checkboxElement as HTMLFormElement);
    const formDataKeys = Array.from(formData.keys());
    const filteredItems = categorizedItems.filter(
      (item, index) => !item.isDivider && !formDataKeys.includes("" + index)
    );
    updateGroceryList(auth()?.username, filteredItems);
    setGroceryList(filteredItems);
    (checkboxElement as HTMLFormElement).reset();
  };

  return (
    <Box sx={{ display: "flex", padding: "24px" }}>
      <form id="grocery-checklist">
        <Grid container spacing={3}>
          <Grid item container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">Grocery List</Typography>
            </Grid>
            {categorizedItems.map((ing, index) => {
              return (
                <Grid item xs={12} key={index}>
                  {ing.isDivider ? (
                    <Typography variant="h6">{ing.element}</Typography>
                  ) : (
                    <div key={index} className="grocery-list">
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
                  )}
                </Grid>
              );
            })}
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
      </form>
    </Box>
  );
};

export default GroceryList;
