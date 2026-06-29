-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_user_ingredient_id_fkey";

-- CreateTable
CREATE TABLE "meal_plans" (
    "id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan_entries" (
    "id" UUID NOT NULL,
    "meal_plan_id" UUID NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "meal_plan_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan_entry_recipes" (
    "id" UUID NOT NULL,
    "meal_plan_entry_id" UUID NOT NULL,
    "recipe_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "meal_plan_entry_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meal_plans_created_by_id_idx" ON "meal_plans"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "meal_plan_entries_meal_plan_id_date_key" ON "meal_plan_entries"("meal_plan_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "meal_plan_entry_recipes_meal_plan_entry_id_sort_order_key" ON "meal_plan_entry_recipes"("meal_plan_entry_id", "sort_order");

-- AddForeignKey
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_entries" ADD CONSTRAINT "meal_plan_entries_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_entry_recipes" ADD CONSTRAINT "meal_plan_entry_recipes_meal_plan_entry_id_fkey" FOREIGN KEY ("meal_plan_entry_id") REFERENCES "meal_plan_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_entry_recipes" ADD CONSTRAINT "meal_plan_entry_recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_user_ingredient_id_fkey" FOREIGN KEY ("user_ingredient_id") REFERENCES "user_ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
