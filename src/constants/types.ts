export type Recipe = {
  key: string;
  title: string;
  ingredients: Ingredient[];
  steps: Step[];
  servings: number;
  photo: string | undefined;
  thumbnail: string | undefined;
  tags: string[];
  url: string;
  dateAdded: number;
};

export type Ingredient = {
  isDivider: boolean;
  amount?: number;
  unit?: string;
  element: string;
  fdcId?: string;
  fdcQuery?: string;
  foodCategory?: string;
};

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
  photo: undefined,
  thumbnail: undefined,
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
