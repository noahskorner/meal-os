import { NextResponse } from "next/server";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const scope = createServiceScope();
  const listIngredientCategoriesController = await scope.resolve(
    SERVICE_TOKENS.listIngredientCategoriesController,
  );
  const response = await listIngredientCategoriesController.get();

  return NextResponse.json(response.body, { status: response.status });
}
