export type Recipe = {
  title: String;
  ingredients: Ingredient[] | undefined;
  steps: String[] | undefined;
  servings: Number;
  photo: string;
  tags: string[];
};

export type Ingredient = {
  amount: number;
  element: string;
};
