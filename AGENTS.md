# Repository Guidelines

## Project Structure & Module Organization

- This repository is an npm workspace managed with Turborepo.
- Application code lives in `apps/`:
  - `apps/web` — Next.js web application
  - `apps/mobile` — Expo / React Native application
- Shared packages live in `packages/`:
  - `packages/ui` — Reusable React components
  - `packages/eslint-config` — Shared ESLint configuration
  - `packages/typescript-config` — Shared TypeScript configuration and base `tsconfig` presets
  - `packages/db` — Prisma schema, migrations, and generated client
- Web application structure:
  - `apps/web/public` — Static assets
  - `apps/web/src/app` — Next.js App Router routes and layouts
- Mobile application structure:
  - `apps/mobile/src/app` — Expo Router routes and layouts

### Vertical Slice Architecture

- Organize backend code by feature and use case, not by technical layer.
- Keep each slice focused on one user action or business capability.
- Prefer feature-local code over shared abstractions.
- Only move code into shared libraries when it is reused across multiple slices.

For this repo's Next.js app, keep API route files in `apps/web/src/app/api` and feature implementation in `apps/web/src/app/features`.

Example:

```text
apps/web/src/app/api/health-check/route.ts
apps/web/src/app/features/health-check/
  health-check.route.ts
  health-check.request.ts
  health-check.response.ts
  health-check.service.ts
  health-check.facade.ts
```

Route files should only:

- Register the Next.js handler.
- Parse incoming requests.
- Delegate to a slice facade.
- Return HTTP responses.

Do not place business logic, persistence, or orchestration in route files.

Within a slice:

- `*.route.ts`: feature-local route registration and OpenAPI metadata.
- `*.request.ts`: Zod request schemas and inferred types.
- `*.response.ts`: Zod response schemas and inferred types.
- `*.service.ts`: atomic business logic.
- `*.repository.ts`: persistence operations when a slice needs storage.
- `*.facade.ts`: slice entry point that coordinates services, repositories, and workflows.

Keep `apps/web/src/app/api/**/route.ts` for Next.js handlers, and use feature `*.route.ts` files for documentation and registration concerns.

Keep dependencies flowing inward: `route.ts -> facade.ts -> service.ts -> repository.ts`.

### Mobile App Architecture

The mobile application in `apps/mobile` is an Expo app built with React Native, Expo Router, NativeWind, and shared theme/setup in the root layout. Treat `apps/mobile/src/app` as the routing and screen entry layer only, and keep feature implementation in `apps/mobile/src/features`.

For the mobile app:

- Organize code by feature or domain, not by technical layer.
- Keep Expo Router route files thin: define navigation, read route params, and delegate to feature screens or facades.
- Put shared, reusable React Native UI components in `apps/mobile/components`.
- Keep feature-specific components inside their owning slice in `apps/mobile/src/features/**`.
- Prefer composing shared components from `apps/mobile/components` instead of duplicating UI across feature slices.
- Keep cross-feature utilities, theme helpers, and shared hooks in stable shared locations such as `apps/mobile/src/lib` when they are genuinely reused.

Expected mobile structure:

```text
apps/mobile/
  app.json
  assets/
  components/
    ui/
      button.tsx
      input.tsx
      card.tsx
  src/
    app/
      _layout.tsx
      index.tsx
      (tabs)/
        home.tsx
    features/
      home/
        home-screen.tsx
      profile/
        profile-screen.tsx
    lib/
      theme.ts
      utils/
        cn.ts
```

### React Native Reusables Components

When adding components from React Native Reusables, always install them with the CLI. Do not manually create or copy React Native Reusables component files unless there is a documented reason to do so.

Examples:

```bash
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add input
npx @react-native-reusables/cli@latest add card
```

Treat the CLI as the source of truth for installing and updating reusable React Native components.

## Build, Test, and Development Commands

Run commands from the repository root unless you need a package-specific script.

- `npm install`: install workspace dependencies.
- `npm run dev`: start all development tasks through Turborepo; the web app runs on port `3000`.
- `npm run build`: build all workspaces with task caching.
- `npm run lint`: run ESLint across the repo.
- `npm run check-types`: run TypeScript checks across workspaces.
- `npm run format`: format `*.ts`, `*.tsx`, and `*.md` files with Prettier.
- `npm run dev -- --filter=web`: run only the web app when you do not need the full workspace.
- `npm run dev -- --filter=mobile`: run only the mobile app through Turborepo when you do not need the full workspace.
- `npm run start --workspace=mobile`: start the Expo app directly.
- `npm run android --workspace=mobile`: open the Expo app on Android.
- `npm run ios --workspace=mobile`: open the Expo app on iOS.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow the existing style: double quotes, semicolons, and 2-space indentation as enforced by Prettier and the current source files. Export React components in `PascalCase`, keep utility values and functions in `camelCase`, and name files by their primary export or role, for example `button.tsx`, `page.tsx`, or `base.js`. Prefer placing shared web UI in `packages/ui/src` and importing it via the workspace alias, such as `@repo/ui/button`. For React Native, place shared UI building blocks in `apps/mobile/components`, and keep slice-specific mobile components inside their feature directories.

### Database Conventions

- All database table names must be plural.
- All database columns must use `snake_case`.
- All Prisma models and TypeScript properties must use `camelCase`.
- Use Prisma `@@map` and `@map` annotations to map database objects to TypeScript-friendly names.

```prisma
model User {
  id        String   @id @map("id")
  firstName String   @map("first_name")
  createdAt DateTime @map("created_at")

  @@map("users")
}
```

## Testing Guidelines

There is no dedicated test runner configured yet. For now, treat `npm run lint` and `npm run check-types` as the required validation before opening a PR. When adding tests, keep them next to the code they cover or in a nearby `__tests__/` directory, and use `*.test.ts` or `*.test.tsx` naming so they are easy to discover.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit style, for example `chore: Removes docs application`. Follow the same `type: summary` pattern (`feat`, `fix`, `chore`, `docs`, etc.) with short imperative summaries. Pull requests should describe the change, list validation performed, link related issues, and include screenshots for UI updates in `apps/web`.

## Configuration Notes

Use Node `>=18` and npm `10.8.2` as declared in `package.json`. Turborepo task inputs include `.env*`, so document new environment variables and avoid committing secrets.
