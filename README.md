# 🧑‍🍳 Meal OS

Meal OS is a meal planning and grocery workflow app. It helps households manage shared shopping lists, save recipes, plan meals for the week, and generate grocery lists from meal plans.

The repo is an npm workspace managed with Turborepo.

## What's inside

```text
apps/
├── web         # Next.js app and API
├── web-test    # API integration and unit tests
└── mobile      # Expo / React Native app

packages/
├── db                 # Prisma schema, migrations, and generated client
├── ui                 # Shared React components
├── web-api-client     # Generated OpenAPI SDK
├── eslint-config
└── typescript-config
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

Requires Node `>=18` and npm `10.8.2`.

### 2. Create env files

Copy the example files and fill in the Supabase/Postgres values.

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cp packages/db/.env.example packages/db/.env
```

The main values are:

- `DATABASE_URL`: Supabase transaction pooler connection string
- `DIRECT_URL`: direct/session database connection string for Prisma CLI commands
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_WEB_URL`

### 3. Set up the database

```bash
npm run db:generate
npm run db:migrate:dev
npm run db:seed
```

### 4. Start development

Run everything:

```bash
npm run dev
```

Run only the web app:

```bash
npm run dev -- --filter=web
```

Run only the mobile app:

```bash
npm run dev -- --filter=mobile
```

## Common commands

```bash
npm run lint
npm run check-types
npm run test
npm run build
npm run generate:client
```

Run the full local validation:

```bash
npm run check
```

## API client

The web API client is generated into `packages/web-api-client` and imported as `@repo/web-api-client`.

Regenerate it after changing API routes, OpenAPI metadata, DTOs, or request schemas:

```bash
npm run generate:client
```

## Tests

API and unit tests live in `apps/web-test`.

```bash
npm run test
npm run test:unit
npm run test:e2e
```

The Playwright test server defaults to port `3020`. Set `PORT` or `PLAYWRIGHT_BASE_URL` when needed.
