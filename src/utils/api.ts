import axios, { AxiosError } from "axios";
import {
  FdcNutrientId,
  Ingredient,
  IngredientPortion,
  MealEntry,
  Nutrient,
  Recipe,
} from "./types";
import qs from "qs";
import { extractDate } from "./helpers";

const URI = process.env.REACT_APP_SERVER_URI;
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

export const addMealEntry = async (data: MealEntry) => {
  try {
    const response = await axios.post(`${URI}/log/add`, {
      ...data,
      date: extractDate(data.date),
    });
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};

export const upload = async (file: FormData) => {
  try {
    const response = await axios.post(`${URI}/image/upload`, file);
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

export const getFdcIngredientById = async (fdcId: number) => {
  try {
    const fdcResponse = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
      {
        params: {
          api_key: FDC_API_KEY,
        },
      }
    );
    return fdcResponse;
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) console.log(error.response);
  }
};

export const getFdcUnits = async (fdcId: number) => {
  try {
    const fdcResponse = await getFdcIngredientById(fdcId);
    if (!fdcResponse) return;
    return fdcResponse.data.foodPortions.map(
      (portion: { amount: string; modifier: string }) =>
        `${parseFloat(portion.amount)} ${portion.modifier}`
    );
  } catch (e) {
    const error = e as AxiosError;
    if (error.response) console.log(error.response);
  }
};

export const addFdcIngredient = async (fdcId?: number) => {
  if (!fdcId) return;
  try {
    // check if it already exists first
    const response = await getFdcIngredient(fdcId);
    if (response?.data) return;

    // get the data from FDC API
    const fdcResponse = await getFdcIngredientById(fdcId);
    if (!fdcResponse) return;

    // get the nutritional values we're interested in
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

    // get the ingredient portions
    const portions: IngredientPortion[] = [];
    fdcResponse.data.foodPortions &&
      fdcResponse.data.foodPortions.forEach(
        (entry: {
          measureUnit: { name: string };
          gramWeight: number;
          amount: number;
          modifier: string;
        }) => {
          portions.push({
            gramWeight: entry.gramWeight,
            amount: entry.amount,
            unit: entry.modifier,
          });
        }
      );

    const fdcIngredient = {
      fdcId: fdcId,
      category: fdcResponse.data.foodCategory.description,
      nutrition: nutrition,
      portions: portions,
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

export const sendChatMessage = async (messages: string[]) => {
  console.log(messages);
  if (!messages || !messages.length) return;
  try {
    const response = await axios.get(`${URI}/chat`, {
      params: { body: messages },
    });
    return response;
  } catch (e) {
    const error = e as AxiosError;
    return error.response;
  }
};
