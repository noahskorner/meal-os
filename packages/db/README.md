# `@repo/db`

Centralized Prisma and Supabase database package for the workspace.

## Environment variables

Create `packages/db/.env` with:

```env
# Runtime connections should use the Supabase pooled connection string.
DATABASE_URL="postgres://prisma.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Prisma CLI commands should use the direct or session connection string.
DIRECT_URL="postgres://prisma.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
```

## Commands

- `npm run db:generate`
- `npm run db:migrate:dev`
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run db:studio`
- `npm run db:validate`

## Seeding

This package uses Prisma's recommended `prisma db seed` flow.

- Run the full seed set from the repository root with `npm run seed`.
- Run only the database workspace seed with `npm run db:seed`.
- The Prisma CLI entrypoint is `packages/db/prisma/seed.ts`.

### Seed Structure

- `prisma/seed.ts`: central runner that initializes Prisma and executes seeds in dependency order.
- `prisma/seeds/helpers.ts`: shared helpers and seed task types.
- `prisma/seeds/ingredient-categories.seed.ts`: reference categories for the ingredient catalog.
- `prisma/seeds/units.seed.ts`: cooking, grocery, package, and bulk-purchase units.
- `prisma/seeds/ingredients.seed.ts`: curated MVP ingredient catalog.
- `prisma/seeds/ingredient-aliases.seed.ts`: normalization aliases for recipe imports.
- `prisma/seeds/recipe-tags.seed.ts`: recipe discovery and filtering tags.

### Adding New Seed Data

1. Add or update a `*.seed.ts` file in `packages/db/prisma/seeds`.
2. Keep records idempotent by using a stable unique key and `upsert`.
3. Export the new task and register it in `prisma/seeds/index.ts` in dependency order.
4. Prefer typed `const` data with narrow string unions so references between seed files stay checked by TypeScript.
5. Run `npm run check-types` and `npm run seed` after changes.
