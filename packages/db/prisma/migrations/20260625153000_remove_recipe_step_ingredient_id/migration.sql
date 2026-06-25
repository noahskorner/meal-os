ALTER TABLE "recipe_steps" DROP CONSTRAINT "recipe_steps_ingredient_id_fkey";

ALTER TABLE "recipe_steps" DROP COLUMN "ingredient_id";
