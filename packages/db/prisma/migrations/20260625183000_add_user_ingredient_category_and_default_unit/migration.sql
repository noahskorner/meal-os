-- AlterTable
ALTER TABLE "user_ingredients"
ADD COLUMN "category_id" UUID,
ADD COLUMN "default_unit_id" UUID;

-- AddForeignKey
ALTER TABLE "user_ingredients"
ADD CONSTRAINT "user_ingredients_category_id_fkey"
FOREIGN KEY ("category_id") REFERENCES "ingredient_categories"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ingredients"
ADD CONSTRAINT "user_ingredients_default_unit_id_fkey"
FOREIGN KEY ("default_unit_id") REFERENCES "units"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
