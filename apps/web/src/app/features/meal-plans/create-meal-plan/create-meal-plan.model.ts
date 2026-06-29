export type CreateMealPlanModel = {
  createdById: string;
  entries: CreateMealPlanEntryModel[];
};

export type CreateMealPlanEntryModel = {
  date: Date;
  recipeIds: string[];
};
