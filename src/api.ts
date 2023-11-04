import axios, { AxiosError } from "axios";
import { Recipe } from "./constants/types";

const URI = process.env.REACT_APP_SERVER_URI;

export const authenticate = async (data: {
  username: string;
  password: string;
}) => {
  console.log(data);
  try {
    const response = await axios.post(`${URI}/authenticate`, data);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const addRecipe = async (data: Recipe) => {
  try {
    const response = await axios.post(`${URI}/recipes/add`, data);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const updateRecipe = async (data: Recipe) => {
  try {
    const response = await axios.put(`${URI}/recipes/:id`, data);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
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

export const getRecipe = async (key: string | undefined) => {
  try {
    const response = await axios.get(`${URI}/recipes/get`, {
      params: {
        key: key,
      },
    });
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};
