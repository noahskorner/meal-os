import { NextRequest, NextResponse } from "next/server";
import { createCreateUserIngredientValidationError } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.controller";
import { createUserIngredientRequestSchema } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.request";
import { createListUserIngredientsValidationError } from "@/app/features/user-ingredients/list-user-ingredients/list-user-ingredients.controller";
import { listUserIngredientsQueryRequestSchema } from "@/app/features/user-ingredients/list-user-ingredients/list-user-ingredients.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const parsedQuery = listUserIngredientsQueryRequestSchema.safeParse({
    searchTerm: request.nextUrl.searchParams.get("searchTerm") ?? undefined,
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      createListUserIngredientsValidationError(
        parsedQuery.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "query";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const listUserIngredientsController = await scope.resolve(
    SERVICE_TOKENS.listUserIngredientsController,
  );
  const response = await listUserIngredientsController.get(parsedQuery.data);

  return NextResponse.json(response.body, { status: response.status });
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsedBody = createUserIngredientRequestSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      createCreateUserIngredientValidationError(
        parsedBody.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "body";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const createUserIngredientController = await scope.resolve(
    SERVICE_TOKENS.createUserIngredientController,
  );
  const response = await createUserIngredientController.post(parsedBody.data);

  return NextResponse.json(response.body, {
    status: response.status,
    headers: "headers" in response ? response.headers : undefined,
  });
}
