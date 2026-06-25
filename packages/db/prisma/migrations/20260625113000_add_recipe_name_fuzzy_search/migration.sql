CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "recipes_name_trigram_idx"
ON "recipes" USING GIN ("name" gin_trgm_ops);
