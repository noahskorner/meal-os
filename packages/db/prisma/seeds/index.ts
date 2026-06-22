import { seedIngredientAliases } from "./ingredient-aliases.seed.js";
import { seedIngredientCategories } from "./ingredient-categories.seed.js";
import { seedIngredients } from "./ingredients.seed.js";
import type { SeedTask } from "./helpers.js";
import { seedRecipeTags } from "./recipe-tags.seed.js";
import { seedUnits } from "./units.seed.js";

export const seedTasks: readonly SeedTask[] = [
  seedIngredientCategories,
  seedUnits,
  seedIngredients,
  seedIngredientAliases,
  seedRecipeTags,
];
