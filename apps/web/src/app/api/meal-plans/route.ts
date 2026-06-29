import { NextRequest, NextResponse } from "next/server";
import { createCreateMealPlanValidationError } from "@/app/features/meal-plans/create-meal-plan/create-meal-plan.controller";
import { createMealPlanRequestSchema } from "@/app/features/meal-plans/create-meal-plan/create-meal-plan.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsedBody = createMealPlanRequestSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      createCreateMealPlanValidationError(
        parsedBody.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "body";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const createMealPlanController = await scope.resolve(
    SERVICE_TOKENS.createMealPlanController,
  );
  const response = await createMealPlanController.post(parsedBody.data);

  return NextResponse.json(response.body, {
    status: response.status,
    headers: "headers" in response ? response.headers : undefined,
  });
}
