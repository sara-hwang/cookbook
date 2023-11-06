export type Recipe = {
  key: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  servings: number;
  photo: string | undefined;
  tags: string[];
  url: string;
};

export type Ingredient = {
  amount: number;
  unit: Unit;
  element: string;
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
  tags: [],
  url: "",
};

export const DEFAULT_PHOTO =
  "https://www.bunsenburnerbakery.com/wp-content/uploads/2020/02/banana-bread-muffins-26-square-735x735.jpg";
