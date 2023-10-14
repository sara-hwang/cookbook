export type Recipe = {
  title: string;
  ingredients: Ingredient[] | undefined;
  steps: string[] | undefined;
  servings: number;
  photo: string | undefined;
  tags: string[];
};

export type Ingredient = {
  amount: number;
  element: string;
};
