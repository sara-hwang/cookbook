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
    alert("Recipe returned " + response?.data + ", server may be down.");
  }
}

export async function getRecipesList() {
  const response = await getAllRecipes();
  if (response && response.status === 200) {
    return response.data;
  } else {
    alert("Recipes returned " + response?.data + ", server may be down.");
    return [];
  }
}

export async function getAllTags() {
  const response = await getAllRecipes();
  if (response && response.status === 200) {
    const tags = new Set<string>();
    response.data.forEach((recipe: Recipe) => {
      recipe.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  } else {
    alert("Tags returned " + response?.data + ", server may be down.");
    return [];
  }
}