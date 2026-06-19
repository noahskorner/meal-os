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
- `npm run db:studio`
- `npm run db:validate`
