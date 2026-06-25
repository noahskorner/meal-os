import { NextRequest, NextResponse } from "next/server";
import { createGetUserIngredientValidationError } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.controller";
import { getUserIngredientRequestSchema } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

type GetUserIngredientRouteContext = {
  params: Promise<{
    userIngredientId: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: GetUserIngredientRouteContext,
) {
  const routeParams = await params;
  const parsedParams = getUserIngredientRequestSchema.safeParse(routeParams);

  if (!parsedParams.success) {
    return NextResponse.json(
      createGetUserIngredientValidationError(
        parsedParams.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "params";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const getUserIngredientController = await scope.resolve(
    SERVICE_TOKENS.getUserIngredientController,
  );
  const response = await getUserIngredientController.get(parsedParams.data);

  return NextResponse.json(response.body, { status: response.status });
}
