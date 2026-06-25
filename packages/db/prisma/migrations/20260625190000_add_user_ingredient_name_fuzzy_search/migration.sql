CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "user_ingredients_name_trigram_idx"
ON "user_ingredients" USING GIN ("name" gin_trgm_ops);
