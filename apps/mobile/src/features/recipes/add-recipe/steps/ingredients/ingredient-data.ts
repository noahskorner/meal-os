import { Ingredient, RecipeIngredient } from "./ingredient-types";

export const ingredients: Ingredient[] = [
  {
    id: "chicken-breast",
    name: "Chicken breast, skinless",
    category: "Poultry",
    defaultAmount: "2 lbs",
  },
  {
    id: "chicken-thighs",
    name: "Chicken thighs, boneless",
    category: "Poultry",
    defaultAmount: "1 lb",
  },
  {
    id: "olive-oil",
    name: "Olive oil",
    category: "Oils",
    defaultAmount: "2 tbsp",
  },
  {
    id: "garlic-minced",
    name: "Garlic, minced",
    category: "Spices",
    defaultAmount: "3 cloves",
  },
  {
    id: "garlic-powder",
    name: "Garlic powder",
    category: "Spices",
    defaultAmount: "1 tsp",
  },
  {
    id: "lemon-juice",
    name: "Lemon juice",
    category: "Fruits",
    defaultAmount: "1 tbsp",
  },
  {
    id: "ground-chicken",
    name: "Ground chicken",
    category: "Poultry",
    defaultAmount: "1 lb",
  },
];

export const createIngredient = (name: string): Ingredient => ({
  id: `new-${Date.now()}`,
  name,
  category: "Custom",
  defaultAmount: "to taste",
});

export const updateSortOrder = (items: RecipeIngredient[]) =>
  items.map((item, sortOrder) => ({ ...item, sortOrder }));
