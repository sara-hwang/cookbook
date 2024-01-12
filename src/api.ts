import axios, { AxiosError } from "axios";
import { FdcNutrientId, Ingredient, Nutrient, Recipe } from "./constants/types";
import qs from "qs";

const URI = process.env.REACT_APP_SERVER_URI;
const AUTH = "Client-ID " + process.env.REACT_APP_IMGUR_CLIENT_ID;
const FDC_API_KEY = process.env.REACT_APP_FDC_API_KEY;

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
    console.log(error.message);
    return error.response;
  }
};

export const addRecipe = async (data: Recipe) => {
  if (!data.dateAdded) data.dateAdded = Date.now();
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

export const deleteRecipe = async (key: string | undefined) => {
  try {
    const response = await axios.delete(`${URI}/recipes/${key}`);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const getIngredientSearch = async (
  query: string,
  signal: AbortSignal
) => {
  try {
    const response = await axios.get(
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          query: query,
          dataType: ["SR Legacy"],
          api_key: FDC_API_KEY,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
        signal,
      }
    );
    if (response.status === 200) return response;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) console.log(error.response);
  }
};

export const addFdcIngredient = async (fdcId?: number) => {
  if (!fdcId) return;
  try {
    const fdcResponse = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
      {
        params: {
          api_key: FDC_API_KEY,
        },
      }
    );

    const nutrition: Nutrient[] = [];
    fdcResponse.data.foodNutrients.forEach(
      (entry: {
        nutrient: { id: number; name: string; unitName: string };
        amount: number;
      }) => {
        if (!(entry.nutrient.id in FdcNutrientId)) return;
        nutrition.push({
          name: entry.nutrient.name,
          id: entry.nutrient.id,
          amount: entry.amount,
          unit: entry.nutrient.unitName,
        });
      }
    );

    const fdcIngredient = {
      fdcId: fdcId,
      category: fdcResponse.data.foodCategory.description,
      nutrition: nutrition,
    };
    await axios.post(`${URI}/ingredients/add`, fdcIngredient);
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) console.log(error.response);
  }
};

export const getFdcIngredient = async (fdcId?: number) => {
  if (!fdcId) return;
  try {
    const response = await axios.get(`${URI}/ingredients/${fdcId}`);
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};
