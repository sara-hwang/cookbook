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
  dateAdded?: number;
};

export type Ingredient = {
  amount: number;
  unit: Unit;
  element: string;
};

export type Step = {
  stepNumber: number;
  text: string;
};

export type TabItem = {
  label: string;
  link: string;
};

export enum Unit {
  g,
  mL,
  tsp,
  tbsp,
  cup,
  count,
}

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
};

export const DEFAULT_PHOTO =
  "https://www.bunsenburnerbakery.com/wp-content/uploads/2020/02/banana-bread-muffins-26-square-735x735.jpg";
