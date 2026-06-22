import type { IngredientName } from "./ingredients.seed.js";
import {
  defineSeed,
  getRequiredValue,
  longRunningTransactionOptions,
  toNameIdMap,
} from "./helpers.js";

type IngredientAliasSeed = {
  ingredient: IngredientName;
  aliases: readonly string[];
};

export const ingredientAliases = [
  {
    ingredient: "Bell Pepper",
    aliases: ["Bell Peppers", "Sweet Pepper", "Sweet Peppers", "Capsicum"],
  },
  {
    ingredient: "Red Bell Pepper",
    aliases: ["Red Pepper", "Red Peppers"],
  },
  {
    ingredient: "Green Bell Pepper",
    aliases: ["Green Pepper", "Green Peppers"],
  },
  {
    ingredient: "Yellow Bell Pepper",
    aliases: ["Yellow Pepper", "Yellow Peppers"],
  },
  {
    ingredient: "Green Onion",
    aliases: ["Scallion", "Scallions", "Spring Onion", "Spring Onions"],
  },
  {
    ingredient: "Chickpeas",
    aliases: ["Garbanzo Bean", "Garbanzo Beans"],
  },
  {
    ingredient: "Powdered Sugar",
    aliases: ["Confectioners Sugar", "Confectioners' Sugar", "Icing Sugar"],
  },
  {
    ingredient: "Ground Beef",
    aliases: ["Hamburger", "Hamburger Meat", "Minced Beef"],
  },
  {
    ingredient: "Ground Turkey",
    aliases: ["Turkey Mince", "Minced Turkey"],
  },
  {
    ingredient: "Ground Chicken",
    aliases: ["Chicken Mince", "Minced Chicken"],
  },
  {
    ingredient: "Eggplant",
    aliases: ["Aubergine", "Eggplants"],
  },
  {
    ingredient: "Zucchini",
    aliases: ["Courgette", "Zucchinis"],
  },
  {
    ingredient: "Cilantro",
    aliases: ["Coriander", "Coriander Leaves"],
  },
  {
    ingredient: "Arugula",
    aliases: ["Rocket", "Rocket Leaves"],
  },
  {
    ingredient: "Baby Spinach",
    aliases: ["Spinach Leaves", "Baby Leaf Spinach"],
  },
  {
    ingredient: "Corn Kernels",
    aliases: ["Sweet Corn"],
  },
  {
    ingredient: "All-Purpose Flour",
    aliases: ["AP Flour", "Plain Flour"],
  },
  {
    ingredient: "Baking Soda",
    aliases: ["Bicarbonate of Soda", "Bicarb Soda"],
  },
  {
    ingredient: "Heavy Cream",
    aliases: ["Heavy Whipping Cream", "Double Cream"],
  },
  {
    ingredient: "Half and Half",
    aliases: ["Half-and-Half"],
  },
  {
    ingredient: "Greek Yogurt",
    aliases: ["Greek Yoghurt"],
  },
  {
    ingredient: "Plain Yogurt",
    aliases: ["Plain Yoghurt", "Natural Yogurt", "Natural Yoghurt"],
  },
  {
    ingredient: "Sour Cream",
    aliases: ["Soured Cream"],
  },
  {
    ingredient: "Parmesan Cheese",
    aliases: ["Parm", "Parmigiano Reggiano"],
  },
  {
    ingredient: "Mozzarella Cheese",
    aliases: ["Mozzarella"],
  },
  {
    ingredient: "Cheddar Cheese",
    aliases: ["Cheddar"],
  },
  {
    ingredient: "Shredded Cheddar Cheese",
    aliases: ["Grated Cheddar"],
  },
  {
    ingredient: "Shredded Mozzarella Cheese",
    aliases: ["Grated Mozzarella"],
  },
  {
    ingredient: "Rolled Oats",
    aliases: ["Old-Fashioned Oats", "Old Fashioned Oats"],
  },
  {
    ingredient: "Steel Cut Oats",
    aliases: ["Irish Oats"],
  },
  {
    ingredient: "Macaroni",
    aliases: ["Elbow Macaroni", "Macaroni Pasta"],
  },
  {
    ingredient: "Spaghetti",
    aliases: ["Spaghetti Pasta"],
  },
  {
    ingredient: "Penne",
    aliases: ["Penne Pasta"],
  },
  {
    ingredient: "Fettuccine",
    aliases: ["Fettuccine Pasta"],
  },
  {
    ingredient: "Linguine",
    aliases: ["Linguine Pasta"],
  },
  {
    ingredient: "Ramen Noodles",
    aliases: ["Instant Noodles"],
  },
  {
    ingredient: "Rice Noodles",
    aliases: ["Rice Sticks"],
  },
  {
    ingredient: "Cannellini Beans",
    aliases: ["White Kidney Beans", "White Beans"],
  },
  {
    ingredient: "Kidney Beans",
    aliases: ["Red Kidney Beans"],
  },
  {
    ingredient: "Diced Tomatoes",
    aliases: ["Chopped Tomatoes"],
  },
  {
    ingredient: "Whole Peeled Tomatoes",
    aliases: ["Peeled Tomatoes"],
  },
  {
    ingredient: "Olive Oil",
    aliases: ["Extra Virgin Olive Oil", "EVOO"],
  },
  {
    ingredient: "Barbecue Sauce",
    aliases: ["BBQ Sauce"],
  },
  {
    ingredient: "Sriracha",
    aliases: ["Sriracha Sauce"],
  },
  {
    ingredient: "Soy Sauce",
    aliases: ["Light Soy Sauce"],
  },
  {
    ingredient: "Garlic Powder",
    aliases: ["Powdered Garlic"],
  },
  {
    ingredient: "Onion Powder",
    aliases: ["Powdered Onion"],
  },
  {
    ingredient: "Crushed Red Pepper",
    aliases: ["Red Pepper Flakes", "Chili Flakes"],
  },
  {
    ingredient: "Ground Cumin",
    aliases: ["Cumin Powder"],
  },
  {
    ingredient: "Ground Coriander",
    aliases: ["Coriander Powder"],
  },
  {
    ingredient: "Ground Turmeric",
    aliases: ["Turmeric Powder"],
  },
  {
    ingredient: "Ground Ginger",
    aliases: ["Ginger Powder"],
  },
  {
    ingredient: "Ground Cinnamon",
    aliases: ["Cinnamon Powder"],
  },
  {
    ingredient: "Ground Nutmeg",
    aliases: ["Nutmeg Powder"],
  },
  {
    ingredient: "Ground Allspice",
    aliases: ["Allspice Powder"],
  },
  {
    ingredient: "Ground Cloves",
    aliases: ["Clove Powder"],
  },
  {
    ingredient: "Black Pepper",
    aliases: ["Ground Black Pepper", "Pepper"],
  },
  {
    ingredient: "Dried Oregano",
    aliases: ["Oregano"],
  },
  {
    ingredient: "Dried Basil",
    aliases: ["Basil"],
  },
  {
    ingredient: "Dried Thyme",
    aliases: ["Thyme"],
  },
  {
    ingredient: "Dried Rosemary",
    aliases: ["Rosemary"],
  },
  {
    ingredient: "Dried Parsley",
    aliases: ["Parsley Flakes"],
  },
  {
    ingredient: "Kosher Salt",
    aliases: ["Cooking Salt"],
  },
  {
    ingredient: "Ground Cinnamon",
    aliases: ["Cinnamon"],
  },
  {
    ingredient: "Ground Nutmeg",
    aliases: ["Nutmeg"],
  },
  {
    ingredient: "Ground Ginger",
    aliases: ["Ginger"],
  },
  {
    ingredient: "Ground Turmeric",
    aliases: ["Turmeric"],
  },
  {
    ingredient: "Ground Cumin",
    aliases: ["Cumin"],
  },
  {
    ingredient: "Coriander Seeds",
    aliases: ["Coriander Seed"],
  },
  {
    ingredient: "Cumin Seeds",
    aliases: ["Cumin Seed"],
  },
  {
    ingredient: "Sesame Seeds",
    aliases: ["Sesame Seed"],
  },
  {
    ingredient: "Bay Leaves",
    aliases: ["Bay Leaf"],
  },
  {
    ingredient: "Eggs",
    aliases: ["Egg"],
  },
  {
    ingredient: "Chicken Breast",
    aliases: ["Chicken Breasts"],
  },
  {
    ingredient: "Chicken Thigh",
    aliases: ["Chicken Thighs"],
  },
  {
    ingredient: "Chicken Wings",
    aliases: ["Chicken Wing"],
  },
  {
    ingredient: "Carrot",
    aliases: ["Carrots"],
  },
  {
    ingredient: "Celery",
    aliases: ["Celery Stalks"],
  },
  {
    ingredient: "Tomato",
    aliases: ["Tomatoes"],
  },
  {
    ingredient: "Roma Tomato",
    aliases: ["Roma Tomatoes", "Plum Tomato", "Plum Tomatoes"],
  },
  {
    ingredient: "Cherry Tomato",
    aliases: ["Cherry Tomatoes"],
  },
  {
    ingredient: "Yellow Onion",
    aliases: ["Yellow Onions"],
  },
  {
    ingredient: "Red Onion",
    aliases: ["Red Onions"],
  },
  {
    ingredient: "White Onion",
    aliases: ["White Onions"],
  },
  {
    ingredient: "Sweet Onion",
    aliases: ["Sweet Onions"],
  },
  {
    ingredient: "Russet Potato",
    aliases: ["Russet Potatoes"],
  },
  {
    ingredient: "Yukon Gold Potato",
    aliases: ["Yukon Gold Potatoes"],
  },
  {
    ingredient: "Red Potato",
    aliases: ["Red Potatoes"],
  },
  {
    ingredient: "Sweet Potato",
    aliases: ["Sweet Potatoes"],
  },
  {
    ingredient: "White Mushroom",
    aliases: ["White Mushrooms", "Button Mushroom", "Button Mushrooms"],
  },
  {
    ingredient: "Baby Bella Mushroom",
    aliases: ["Baby Bella Mushrooms", "Cremini Mushroom", "Cremini Mushrooms"],
  },
  {
    ingredient: "Portobello Mushroom",
    aliases: ["Portobello Mushrooms", "Portabella Mushroom", "Portabella Mushrooms"],
  },
  {
    ingredient: "Brussels Sprouts",
    aliases: ["Brussel Sprouts", "Brussels Sprout"],
  },
  {
    ingredient: "Fresh Basil",
    aliases: ["Basil Leaves"],
  },
  {
    ingredient: "Fresh Rosemary",
    aliases: ["Rosemary Sprigs"],
  },
  {
    ingredient: "Fresh Thyme",
    aliases: ["Thyme Sprigs"],
  },
  {
    ingredient: "Garlic",
    aliases: ["Garlic Clove", "Garlic Cloves"],
  },
  {
    ingredient: "Scallops",
    aliases: ["Sea Scallops"],
  },
  {
    ingredient: "Shrimp",
    aliases: ["Prawns"],
  },
  {
    ingredient: "Canned Tuna",
    aliases: ["Tuna Fish", "Tuna in Water", "Tuna in Oil"],
  },
  {
    ingredient: "Canned Salmon",
    aliases: ["Salmon"],
  },
  {
    ingredient: "Flour Tortillas",
    aliases: ["Flour Wraps"],
  },
  {
    ingredient: "Corn Tortillas",
    aliases: ["Corn Wraps"],
  },
  {
    ingredient: "Sandwich Bread",
    aliases: ["Sliced Bread"],
  },
  {
    ingredient: "Powdered Sugar",
    aliases: ["10X Sugar"],
  },
] satisfies readonly IngredientAliasSeed[];

export const seedIngredientAliases = defineSeed("ingredient_aliases", async (prisma) =>
  prisma.$transaction(
    async (tx) => {
      const ingredientRecords = await tx.ingredient.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      const ingredientIds = toNameIdMap(ingredientRecords);

      let totalAliases = 0;

      for (const aliasGroup of ingredientAliases) {
        const ingredientId = getRequiredValue(
          ingredientIds,
          aliasGroup.ingredient,
          "Ingredient",
        );

        for (const alias of aliasGroup.aliases) {
          await tx.ingredientAlias.upsert({
            where: {
              ingredientId_alias: {
                ingredientId,
                alias,
              },
            },
            update: {},
            create: {
              ingredientId,
              alias,
            },
          });

          totalAliases += 1;
        }
      }

      return totalAliases;
    },
    longRunningTransactionOptions,
  ),
);
