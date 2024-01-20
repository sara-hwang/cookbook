export type Recipe = {
  key: string;
  title: string;
  ingredients: Ingredient[];
  steps: Step[];
  servings: number;
  photo?: string;
  thumbnail?: string;
  tags: string[];
  url: string;
  dateAdded: number;
  notes?: string;
};

export type Ingredient = {
  isDivider: boolean;
  amount?: number;
  unit?: string;
  element: string;
  fdcId?: number;
  fdcQuery?: string;
};

export type FdcIngredient = {
  fdcId: number;
  category: string;
  nutrition: Nutrient[];
  portions: IngredientPortion[];
};

export type Nutrient = {
  name: string;
  id: number;
  amount: number;
  unit: string;
};

export type IngredientPortion = {
  gramWeight: number;
  amount: number;
  unit: string;
};

export enum FdcNutrientId {
  calories = 1008,
  protein = 1003,
  fat = 1004,
  carbs = 1005,
  fiber = 1079,
  totalSugars = 2000,
  calcium = 1087,
  iron = 1089,
  sodium = 1093,
  saturatedFat = 1258,
  cholesterol = 1253,
  transFat = 1257,
}

export type Step = {
  isDivider: boolean;
  text: string;
};

export type TabItem = {
  label: string;
  link: string;
};

export const UnitMenuItem = {
  g: ["g", "gram", "gs", "grams"],
  ml: ["ml", "millilitre", "milliliter", "mls", "millilitres", "milliliters"],
  tsp: ["tsp", "teaspoon", "tsps", "teaspoons"],
  tbsp: ["tbsp", "tablespoon", "tbsps", "tablespoons"],
  cup: ["cup", "cups"],
  count: ["count", "unit"],
};

export const EmptyRecipe = {
  key: "",
  title: "",
  servings: 1,
  ingredients: [],
  steps: [],
  tags: [],
  url: "",
  dateAdded: 0,
};

export const DEFAULT_PHOTO =
  "https://www.bunsenburnerbakery.com/wp-content/uploads/2020/02/banana-bread-muffins-26-square-735x735.jpg";

export type FdcFoodItem = {
  fdcId: number;
  dataType: string;
  description: string;
  foodCode: string;
  foodNutrients: FdcFoodNutrient[];
  publicationDate: string;
  scientificName: string;
  brandOwner: string;
  gtinUpc: string;
  ingredients: string;
  ndbNumber: number;
  additionalDescriptions: string;
  allHighlightFields: string;
  score: number;
};

export type FdcFoodNutrient = {
  number: number;
  name: string;
  amount: number;
  unitName: string;
  derivationCode: string;
  derivationDescription: string;
};
