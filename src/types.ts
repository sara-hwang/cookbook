export type Recipe = {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  servings: number;
  photo: string | undefined;
  tags: string[];
};

export type Ingredient = {
  amount: number;
  element: string;
};

export type TabItem = {
  label: string;
  link: string;
};
