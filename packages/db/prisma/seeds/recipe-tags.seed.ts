import { defineSeed, longRunningTransactionOptions } from "./helpers.js";

const cuisineTags = [
  "Italian",
  "Mexican",
  "American",
  "Chinese",
  "Japanese",
  "Thai",
  "Indian",
  "Mediterranean",
  "Greek",
  "French",
  "Spanish",
  "Korean",
  "Vietnamese",
  "Middle Eastern",
  "Tex-Mex",
  "Southern",
  "Cajun",
  "BBQ",
] as const;

const mealTypeTags = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Appetizer",
  "Side Dish",
  "Snack",
  "Dessert",
  "Main Course",
  "Soup",
  "Salad",
  "Sandwich",
  "Pasta",
  "Pizza",
  "Taco",
  "Bowl",
] as const;

const dietaryTags = [
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Dairy Free",
  "Nut Free",
  "Egg Free",
  "Low Carb",
  "Keto",
  "Paleo",
  "Whole30",
  "High Protein",
  "Low Sodium",
  "Halal",
  "Kosher",
  "Pescatarian",
] as const;

const proteinTags = [
  "Chicken",
  "Beef",
  "Pork",
  "Turkey",
  "Seafood",
  "Shrimp",
  "Salmon",
  "Tofu",
  "Beans",
  "Lentils",
  "Egg",
  "Cheese",
] as const;

const methodTags = [
  "Grill",
  "Roast",
  "Bake",
  "Broil",
  "Saute",
  "Stir-Fry",
  "Slow Cooker",
  "Instant Pot",
  "Air Fryer",
  "Sheet Pan",
  "One Pot",
  "No Cook",
] as const;

const difficultyTags = ["Easy", "Intermediate", "Advanced"] as const;

const prepTimeTags = [
  "15 Minutes or Less",
  "30 Minutes or Less",
  "1 Hour or Less",
  "Make Ahead",
] as const;

const seasonalTags = ["Spring", "Summer", "Fall", "Winter", "Holiday"] as const;

const categoryTags = [
  "Kid Friendly",
  "Meal Prep",
  "Freezer Friendly",
  "Comfort Food",
  "Weeknight",
  "Party Food",
  "Picnic",
  "Potluck",
  "Spicy",
  "Healthy",
  "Family Style",
  "Budget Friendly",
  "Date Night",
  "Game Day",
  "Breakfast for Dinner",
  "Sauce",
  "Marinade",
] as const;

export const recipeTags = [
  ...cuisineTags,
  ...mealTypeTags,
  ...dietaryTags,
  ...proteinTags,
  ...methodTags,
  ...difficultyTags,
  ...prepTimeTags,
  ...seasonalTags,
  ...categoryTags,
] as const;

export const seedRecipeTags = defineSeed("recipe_tags", async (prisma) =>
  prisma.$transaction(
    async (tx) => {
      for (const name of recipeTags) {
        await tx.recipeTag.upsert({
          where: {
            name,
          },
          update: {},
          create: {
            name,
          },
        });
      }

      return recipeTags.length;
    },
    longRunningTransactionOptions,
  ),
);
