# Repository Guidelines

## Project Structure & Module Organization
This repository is an npm workspace managed with Turborepo. Application code lives in `apps/`, with the current Next.js app in `apps/web`. Shared packages live in `packages/`: `packages/ui` contains reusable React components, `packages/eslint-config` holds shared lint rules, and `packages/typescript-config` stores base `tsconfig` presets. Static assets for the web app are in `apps/web/public`, and App Router files are under `apps/web/app`.

## Build, Test, and Development Commands
Run commands from the repository root unless you need a package-specific script.

- `npm install`: install workspace dependencies.
- `npm run dev`: start all development tasks through Turborepo; the web app runs on port `3000`.
- `npm run build`: build all workspaces with task caching.
- `npm run lint`: run ESLint across the repo.
- `npm run check-types`: run TypeScript checks across workspaces.
- `npm run format`: format `*.ts`, `*.tsx`, and `*.md` files with Prettier.
- `npm run dev -- --filter=web`: run only the web app when you do not need the full workspace.

## Coding Style & Naming Conventions
Use TypeScript throughout. Follow the existing style: double quotes, semicolons, and 2-space indentation as enforced by Prettier and the current source files. Export React components in `PascalCase`, keep utility values and functions in `camelCase`, and name files by their primary export or role, for example `button.tsx`, `page.tsx`, or `base.js`. Prefer placing shared UI in `packages/ui/src` and importing it via the workspace alias, such as `@repo/ui/button`.

## Testing Guidelines
There is no dedicated test runner configured yet. For now, treat `npm run lint` and `npm run check-types` as the required validation before opening a PR. When adding tests, keep them next to the code they cover or in a nearby `__tests__/` directory, and use `*.test.ts` or `*.test.tsx` naming so they are easy to discover.

## Commit & Pull Request Guidelines
Recent history uses Conventional Commit style, for example `chore: Removes docs application`. Follow the same `type: summary` pattern (`feat`, `fix`, `chore`, `docs`, etc.) with short imperative summaries. Pull requests should describe the change, list validation performed, link related issues, and include screenshots for UI updates in `apps/web`.

## Configuration Notes
Use Node `>=18` and npm `10.8.2` as declared in `package.json`. Turborepo task inputs include `.env*`, so document new environment variables and avoid committing secrets.
