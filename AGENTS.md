# Repository Guidelines

## Core Principles

- Prefer simple solutions over abstractions.
- Organize code by feature, not by technical layer.
- Keep dependencies flowing inward.
- Keep route files and screens thin.
- Prefer feature-local code over shared code.
- Only create shared abstractions after proven reuse.
- Do not introduce architectural patterns not already used by the repository.
- Update tests, types, and documentation when changing behavior.

---

# Workspace Structure

This repository is an npm workspace managed with Turborepo.

## Applications

```text
apps/
├── web         # Next.js application + API
├── web-test    # API integration and unit tests
└── mobile      # Expo / React Native application
```

## Packages

```text
packages/
├── db                 # Prisma schema, migrations, generated client
├── ui                 # Shared React components
├── web-api-client     # Generated OpenAPI SDK
├── eslint-config
└── typescript-config
```

---

# Backend Architecture

## Vertical Slice Architecture

Organize backend code by business capability and use case.

### Example

```text
apps/web/src/app/api/health-check/route.ts

apps/web/src/app/features/health-check/
├── health-check.route.ts
├── health-check.di.ts
├── health-check.request.ts
├── health-check.dto.ts
├── health-check.response.ts
├── health-check.controller.ts
├── health-check.facade.ts
├── health-check.model.ts
├── health-check.service.ts
└── health-check.repository.ts
```

---

## Layer Responsibilities

### route.ts

Responsibilities:

- Register Next.js handlers
- Parse HTTP requests
- Resolve controller
- Return HTTP responses

Must not contain:

- Business logic
- Persistence logic
- Authorization logic
- Workflow orchestration

---

### \*.controller.ts

Responsibilities:

- Authentication
- Authorization
- Transport-level orchestration
- Request validation coordination
- Mapping internal responses to external DTOs

Controllers are the boundary between internal and external contracts.

---

### \*.facade.ts

Responsibilities:

- Use-case orchestration
- Coordinate services and repositories
- Build internal response contracts

Facades:

- Return `*.response.ts`
- Never return DTOs
- Never perform authentication

---

### \*.service.ts

Responsibilities:

- Atomic business logic
- Domain rules
- Model creation and transformation

Services:

- Must not call repositories
- Must not know about persistence

---

### \*.repository.ts

Responsibilities:

- Database access
- Persistence
- Queries

Repositories:

- Must not contain business logic

---

### \*.dto.ts

External contracts.

Contains:

- OpenAPI schemas
- Zod schemas
- DTO types exposed outside the application

Rules:

- Append `Dto` to TypeScript type names
- Keep OpenAPI schema names stable

Example:

```ts
export type GetProfileResponseDto = ...
```

---

### \*.response.ts

Internal contracts.

Used between:

```text
Facade -> Controller
```

Never exposed externally.

---

### \*.model.ts

Internal domain models only.

Never exposed through APIs.

---

### \*.request.ts

Request schemas and inferred request types.

---

### \*.di.ts

Feature-local dependency registration.

Export:

```ts
registerFeature(services);
```

Example:

```ts
registerListIngredients(services);
```

---

### \*.route.ts

Feature-local OpenAPI metadata and route registration.

Keep all OpenAPI definitions here.

---

## Dependency Flow

```text
route.ts
  ↓
controller.ts
  ↓
facade.ts
  ↓
(service.ts, repository.ts)
```

Services and repositories exist at the same layer.

Typical flow:

```text
Controller
  ↓
Facade
  ↓
Service creates/transforms model
  ↓
Repository persists/retrieves model
  ↓
Facade builds response
  ↓
Controller maps response → DTO
```

Rules:

- DTOs must not flow past controllers.
- Controllers map Response → DTO.
- Services must not call repositories.
- Repositories must not contain business logic.

---

## Protected Endpoints

Perform authentication and authorization in controllers.

Do not perform auth in:

- route.ts
- facade.ts
- repository.ts

---

## CQRS Guidance

For create operations:

- Return `201 Created`
- Include a minimal response body containing the resource identifier (for example, `{ "id": "...", "location": "..." }`)
- Include a `Location` header when appropriate
- Avoid returning the full resource. If the client needs it, fetch it via the corresponding query endpoint.

---

# Dependency Injection

Use:

```text
packages/dependency-injection
```

## Composition Root

Keep application registration in a top-level `services.ts`.

Example:

```ts
registerListIngredients(services);
registerCreateRecipe(services);
registerGetRecipe(services);
```

Responsibilities:

- Shared infrastructure registration
- Prisma registration
- Authentication providers
- Feature registration

---

## DI Rules

Use constructor injection.

Avoid importing infrastructure directly inside slices.

Preferred:

```ts
class CreateRecipeFacade {
  constructor(
    private readonly service: CreateRecipeService,
    private readonly repository: CreateRecipeRepository,
  ) {}
}
```

---

# API Client Generation

The generated SDK lives in:

```text
packages/web-api-client
```

Published as:

```ts
@repo/web-api-client
```

---

## Regeneration

Run after changing:

- OpenAPI metadata
- DTO schemas
- Request schemas
- Endpoint paths

```bash
npm run generate:client
```

---

## Rules

- Never edit generated files.
- Export public SDK APIs from:

```text
packages/web-api-client/src/index.ts
```

- Do not import generated files directly.
- Use stable `operationId` values.

---

## Application Usage

Applications should:

- Configure auth locally
- Configure base URLs locally
- Import generated SDK functions and types from:

```ts
@repo/web-api-client
```

---

# Testing

## Test Workspace

Use the dedicated `apps/web-test` workspace for all API, integration, and unit tests. This keeps Playwright and Vitest dependencies isolated from `apps/web`.

```text
apps/web-test/
├── e2e/   # Playwright API and integration tests
└── unit/  # Vitest unit tests
```

---

## Test Organization

- Put API integration and end-to-end tests in `apps/web-test/e2e`.
- Put unit tests in `apps/web-test/unit`.
- Prefer one folder per API endpoint.

Examples:

```text
apps/web-test/e2e/api/recipes/create-recipe.spec.ts
apps/web-test/e2e/api/recipes/get-recipe.spec.ts
apps/web-test/e2e/api/health-check/health-check.spec.ts
```

- Use `*.spec.ts` for Playwright tests.
- Use `*.test.ts` for Vitest unit tests.

---

## API Testing

Prefer the generated SDK over manual HTTP requests.

Use:

```ts
import "@repo/web-api-client";
```

instead of:

```ts
fetch(...);
const response = json as SomeType;
```

### Client Usage

- Execute API requests through the generated `@repo/web-api-client` SDK.
- Create a configured client via `apps/web-test/e2e/api-client.ts`.
- Use generated operations such as:

```ts
listIngredients();
createRecipe();
getProfile();
```

- Use generated request and response types for test data and assertions.
- Avoid `as` type assertions when generated types are available.
- For routes not exposed as generated operations, use the SDK's low-level methods rather than Playwright's raw `request` fixture.

---

## Authentication & Configuration

Keep test-specific configuration inside the test workspace.

Use:

```ts
createTestApiClient(baseURL);
createAuthHeaders(userId);
```

for API client and authentication setup.

The Playwright test server defaults to port `3020`. Override it with `PORT` when needed, or set `PLAYWRIGHT_BASE_URL` to run against an already-started server.

---

## Prisma Access

Prefer API-level assertions over direct database reads.

Only use database verification when the API cannot practically expose the state being tested (for example, validating persistence side effects before a read endpoint exists).

When database access is required:

- Use the shared Prisma helper.
- Do not create ad-hoc Prisma clients inside tests.

```ts
getTestPrismaClient();
```

Location:

```text
apps/web-test/e2e/prisma-client.ts
```

Database assertions should be rare.

---

## Validation Checklist

Before opening a PR:

```bash
npm run lint
npm run check-types
npm run test
npm run build
```

---

# Mobile Architecture

## Routing Layer

Keep Expo Router files thin.

Responsibilities:

- Navigation
- Route parameters
- Screen composition

Move feature implementation into:

```text
apps/mobile/src/features
```

---

## Structure

```text
apps/mobile/
└── src/
    ├── app/
    ├── features/
    ├── lib/
    └── components/
        └── ui/
```

---

## UI Rules

Shared UI:

```text
apps/mobile/src/components
```

Feature-specific UI:

```text
apps/mobile/src/features/**
```

Use:

```tsx
className = "";
```

Prefer NativeWind over StyleSheet.

---

## React Native Reusables

Always install through the CLI.

Example:

```bash
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add input
npx @react-native-reusables/cli@latest add card
```

Do not manually copy component source.

---

## Color Tokens

Rules:

- Use `brand-*` tokens
- Do not use raw hex values
- Do not modify library semantic tokens
- Add variants instead of changing existing ones

---

# Database Conventions

## Naming

Database:

```text
plural table names
snake_case columns
```

TypeScript:

```text
camelCase properties
PascalCase models
```

---

## Prisma Mapping

Use:

```prisma
@@map(...)
@map(...)
```

Example:

```prisma
model User {
  id        String   @id @map("id")
  firstName String   @map("first_name")
  createdAt DateTime @map("created_at")

  @@map("users")
}
```

---

# Build & Development

Run from repository root.

## Common Commands

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run check-types
npm run format
npm run generate:client
```

## Filtered Development

```bash
npm run dev -- --filter=web
npm run dev -- --filter=mobile
```

## Mobile

```bash
npm run start --workspace=mobile
npm run android --workspace=mobile
npm run ios --workspace=mobile
```

---

# CI/CD

## CI

`.github/workflows/ci.yml`

Runs:

```bash
npm ci
npm run lint
npm run check-types
npm run test
npm run build
```

---

## Deploy

`.github/workflows/deploy.yml`

Deployment order:

1. Prisma migrations
2. Web deployment
3. Mobile web deployment

---

# Deployment Targets

## API

```text
apps/web
```

Deployed using:

```text
VERCEL_API_PROJECT_ID
```

## Mobile Web

```text
apps/mobile
```

Deployed using:

```text
VERCEL_MOBILE_WEB_PROJECT_ID
```

---

# Git Guidelines

Use Conventional Commits.

Examples:

```text
feat: add recipe search
fix: handle missing ingredient
docs: update agents guide
chore: regenerate api client
```

Keep commit messages:

- Short
- Imperative
- Descriptive

---

# Environment Requirements

## Node

```text
>=18
```

## npm

```text
10.8.2
```

---
