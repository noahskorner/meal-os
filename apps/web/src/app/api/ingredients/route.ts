import { NextRequest, NextResponse } from "next/server";
import { createListIngredientsValidationError } from "@/app/features/ingredients/list-ingredients/list-ingredients.controller";
import { listIngredientsRequestSchema } from "@/app/features/ingredients/list-ingredients/list-ingredients.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const parsedQuery = listIngredientsRequestSchema.safeParse({
    searchTerm: request.nextUrl.searchParams.get("searchTerm") ?? undefined,
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      createListIngredientsValidationError(
        parsedQuery.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "query";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const listIngredientsController = await scope.resolve(
    SERVICE_TOKENS.listIngredientsController,
  );
  const response = await listIngredientsController.get(parsedQuery.data);

  return NextResponse.json(response.body, { status: response.status });
}
