export type CreateRecipeInputModel = {
  createdById: string;
  name: string;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
};

export type CreateRecipeModel = {
  id: string;
};
