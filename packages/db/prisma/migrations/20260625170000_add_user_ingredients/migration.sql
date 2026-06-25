-- CreateTable
CREATE TABLE "user_ingredients" (
    "id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_ingredients_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "recipe_ingredients"
ADD COLUMN "user_ingredient_id" UUID,
ALTER COLUMN "ingredient_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_ingredients_created_by_id_name_key" ON "user_ingredients"("created_by_id", "name");

-- AddForeignKey
ALTER TABLE "user_ingredients" ADD CONSTRAINT "user_ingredients_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_user_ingredient_id_fkey" FOREIGN KEY ("user_ingredient_id") REFERENCES "user_ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddConstraint
ALTER TABLE "recipe_ingredients"
ADD CONSTRAINT "recipe_ingredients_exactly_one_ingredient_source_check"
CHECK (
    (
        "ingredient_id" IS NOT NULL
        AND "user_ingredient_id" IS NULL
    )
    OR (
        "ingredient_id" IS NULL
        AND "user_ingredient_id" IS NOT NULL
    )
);
