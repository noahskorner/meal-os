export const newRecipeRoutes = {
  recipes: "/recipes",
  chooseMethod: "/recipes/new",
  manualDetails: "/recipes/new/manual/details",
  manualIngredients: "/recipes/new/manual/ingredients",
  manualInstructions: "/recipes/new/manual/instructions",
  manualReview: "/recipes/new/manual/review",
} as const;

export type NewRecipeRoute = (typeof newRecipeRoutes)[keyof typeof newRecipeRoutes];

