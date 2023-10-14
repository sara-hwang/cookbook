import axios from "axios";
import { Recipe } from "./types";

export const addRecipe = async (data: Recipe) => {
  console.log("submtting");
  console.log(data);
  try {
    await axios.post("http://localhost:3001/add", data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllRecipes = async () => {
  try {
    const response = await axios.get("http://localhost:3001/get");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
