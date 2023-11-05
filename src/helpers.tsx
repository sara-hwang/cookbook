import { getRecipe, getAllRecipes } from "./api";
import { Recipe } from "./constants/types";

export async function getRecipeDetails(
  id: string,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>
) {
  const response = await getRecipe(id);
  if (response && response.status === 200) {
    setRecipe(response.data);
  } else {
    alert(response?.data);
  }
}

export async function getRecipesList() {
  const response = await getAllRecipes();
  if (response && response.status === 200) {
    return response.data;
  } else {
    alert(response?.data);
    return [];
  }
}
