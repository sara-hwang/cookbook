export type MealEntry = {
  date: Date;
  mealName: string;
  recipe: string;
  portions: number;
  user: string;
};

export type Recipe = {
  key: string;
  title: string;
  ingredients: Ingredient[];
  steps: Step[];
  servings: number;
  servingDescription: string;
  photo?: string[];
  thumbnail?: string;
  tags: string[];
  url: string;
  dateAdded: number;
  notes?: string;
  nutritionalValues?: NutritionalProfile;
};

export type Ingredient = {
  isDivider: boolean;
  text: string;
  fdcId?: number;
  fdcQuery?: string;
  fdcUnit?: string;
  fdcAmount?: number;
};

export type FdcIngredient = {
  fdcId: number;
  category: string;
  nutrition: Nutrient[];
  portions: IngredientPortion[];
};

export type NutritionalProfile = {
  _1008: number;
  _1003: number;
  _1004: number;
  _1005: number;
  _1079: number;
  _2000: number;
  _1087: number;
  _1089: number;
  _1093: number;
  _1258: number;
  _1253: number;
  _1257: number;
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
  "Calories" = 1008,
  "Protein" = 1003,
  "Fat" = 1004,
  "Carbs" = 1005,
  "Fiber" = 1079,
  "Total Sugars" = 2000,
  "Calcium" = 1087, // mg
  "Iron" = 1089, // mg
  "Sodium" = 1093, //mg
  "Saturated Fat" = 1258,
  "Cholesterol" = 1253, // mg
  "Trans Fat" = 1257,
}

export type Step = {
  isDivider: boolean;
  text: string;
};

export type TabItem = {
  label: string;
  link: string;
};

export const EmptyRecipe = {
  key: "",
  title: "",
  servings: 1,
  servingDescription: "",
  ingredients: [],
  steps: [],
  tags: [],
  url: "",
  dateAdded: 0,
};

export const DEFAULT_PHOTO =
  "https://www.bunsenburnerbakery.com/wp-content/uploads/2020/02/banana-bread-muffins-26-square-735x735.jpg";

export const RecipeCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Vegetarian",
  "Vegan",
  "Easy",
  "Instant Pot",
  "All",
];
