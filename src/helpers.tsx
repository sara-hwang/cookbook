import { getRecipe } from "./api";
import { Recipe } from "./constants/types";

export async function getRecipeDetails(
  id: string,
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>,
) {
  const response = await getRecipe(id);
  if (response && response.status === 200) {
    setRecipe(response.data);
  } else {
    alert(response?.data);
  }
}
