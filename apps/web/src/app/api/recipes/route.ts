import { NextRequest, NextResponse } from "next/server";
import { createCreateRecipeValidationError } from "@/app/features/recipes/create-recipe/create-recipe.controller";
import { createRecipeRequestSchema } from "@/app/features/recipes/create-recipe/create-recipe.request";
import { createListRecipesValidationError } from "@/app/features/recipes/list-recipes/list-recipes.controller";
import { listRecipesQueryRequestSchema } from "@/app/features/recipes/list-recipes/list-recipes.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const parsedQuery = listRecipesQueryRequestSchema.safeParse({
    searchTerm: request.nextUrl.searchParams.get("searchTerm") ?? undefined,
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      createListRecipesValidationError(
        parsedQuery.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "query";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const listRecipesController = await scope.resolve(
    SERVICE_TOKENS.listRecipesController,
  );
  const response = await listRecipesController.get(parsedQuery.data);

  return NextResponse.json(response.body, {
    status: response.status,
  });
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsedBody = createRecipeRequestSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      createCreateRecipeValidationError(
        parsedBody.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "body";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const createRecipeController = await scope.resolve(
    SERVICE_TOKENS.createRecipeController,
  );
  const response = await createRecipeController.post(parsedBody.data);

  return NextResponse.json(response.body, {
    status: response.status,
    headers: "headers" in response ? response.headers : undefined,
  });
}
