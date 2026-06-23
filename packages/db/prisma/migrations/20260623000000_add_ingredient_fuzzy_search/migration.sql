CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "ingredients_name_trigram_idx"
ON "ingredients" USING GIN ("name" gin_trgm_ops);

CREATE INDEX "ingredient_aliases_alias_trigram_idx"
ON "ingredient_aliases" USING GIN ("alias" gin_trgm_ops);
