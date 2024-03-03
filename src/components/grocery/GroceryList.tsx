import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import {
  getFdcIngredient,
  getGroceryList,
  updateGroceryList,
} from "../../utils/api";
import { Ingredient } from "../../utils/types";
import "./Checkbox.css";
import "../../stylesheets/App.css";
import ClearGroceryDialog from "./ClearGroceryDialog";

export const GroceryList = () => {
  const auth = useAuthUser();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [clear, setClear] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [groceryList, setGroceryList] = useState<Ingredient[]>([]);
  const [categorizedItems, setCategorizedItems] = useState<Ingredient[]>([]);

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

  useEffect(() => {
    const categoryDict: { [categoryName: string]: Ingredient[] } = {};
    const categorizeGroceryList = async () => {
      setLoading(true);
      for (const [index, _] of groceryList.entries()) {
        const response = await getFdcIngredient(groceryList[index].fdcId);
        const foodCategory =
          response && response.status === 200 && response.data
            ? response.data.category
            : "Other";
        if (foodCategory in categoryDict)
          categoryDict[foodCategory].push(groceryList[index]);
        else categoryDict[foodCategory] = [groceryList[index]];
      }
      const flatCategories: Ingredient[] = [];
      Object.keys(categoryDict).forEach((categoryName) => {
        flatCategories.push({ isDivider: true, text: categoryName });
        categoryDict[categoryName].forEach((ing) => flatCategories.push(ing));
      });
      setCategorizedItems(flatCategories);
      setLoading(false);
    };

    categorizeGroceryList();
  }, [groceryList]);

  useEffect(() => {
    if (!clear) return;
    updateGroceryList(auth()?.username, []);
    setGroceryList([]);
    setClear(false);
  }, [clear]);

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
      <ClearGroceryDialog
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        setClear={setClear}
      />
      <form id="grocery-checklist">
        <Grid container spacing={3}>
          <Grid item container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">Grocery List</Typography>
            </Grid>
            {(loading
              ? Array.from({ length: 10 }, (_, index) => ({
                  isDivider: index === 0,
                  text: index === 0 ? "Other" : "",
                }))
              : categorizedItems
            ).map((ing, index) => {
              return (
                <Grid item container xs={12} key={index}>
                  {ing.isDivider ? (
                    <Grid item>
                      <Typography variant="h6">{ing.text}</Typography>
                    </Grid>
                  ) : (
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        name={"" + index}
                        id={`grocery-checkbox-${index}`}
                      />
                      {loading ? (
                        <Skeleton className="grocery-item-label-skeleton" />
                      ) : (
                        <label htmlFor={`grocery-checkbox-${index}`}>
                          {ing.text}
                        </label>
                      )}
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
                  onClick={() => groceryList.length && setPopupOpen(true)}
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
