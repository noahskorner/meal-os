import { defineSeed } from "./helpers.js";

export const ingredientCategories = [
  { name: "Produce" },
  { name: "Meat & Seafood" },
  { name: "Dairy & Eggs" },
  { name: "Bakery" },
  { name: "Grains & Pasta" },
  { name: "Canned Goods" },
  { name: "Baking" },
  { name: "Oils, Vinegars & Condiments" },
  { name: "Herbs & Spices" },
  { name: "Frozen Foods" },
  { name: "Snacks & Beverages" },
] as const satisfies readonly { name: string }[];

export type IngredientCategoryName = (typeof ingredientCategories)[number]["name"];

export const seedIngredientCategories = defineSeed(
  "ingredient_categories",
  async (prisma) =>
    prisma.$transaction(async (tx) => {
      for (const category of ingredientCategories) {
        await tx.ingredientCategory.upsert({
          where: {
            name: category.name,
          },
          update: {},
          create: {
            name: category.name,
          },
        });
      }

      return ingredientCategories.length;
    }),
);
