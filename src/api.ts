import axios from "axios";
import { Recipe } from "./types";

const URI = process.env.REACT_APP_SERVER_URI;

export const addRecipe = async (data: Recipe) => {
  try {
    await axios.post(`${URI}/recipes/add`, data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllRecipes = async () => {
  try {
    const response = await axios.get(`${URI}/recipes/getAll`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRecipe = async (title: string | undefined) => {
  try {
    const response = await axios.get(`${URI}/recipes/get`, {
      params: {
        title: title,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
