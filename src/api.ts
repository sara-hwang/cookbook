import axios, { AxiosError } from "axios";
import { Ingredient, Recipe } from "./constants/types";

const URI = process.env.REACT_APP_SERVER_URI;
const AUTH = "Client-ID " + process.env.REACT_APP_IMGUR_CLIENT_ID;

export const authenticate = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${URI}/authenticate`, data);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const getGroceryList = async (user: string) => {
  try {
    const response = await axios.get(`${URI}/user/${user}/grocery`);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const updateGroceryList = async (user: string, item: Ingredient[]) => {
  try {
    const response = await axios.put(`${URI}/user/${user}/grocery`, item);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const upload = async (file: FormData) => {
  try {
    const response = await axios.post("https://api.imgur.com/3/image/", file, {
      headers: { Authorization: AUTH },
    });
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
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
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
