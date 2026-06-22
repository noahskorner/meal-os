import { NextRequest, NextResponse } from "next/server";
import {
  createCreateRecipeValidationError,
} from "@/app/features/recipes/create-recipe/create-recipe.controller";
import { createRecipeRequestSchema } from "@/app/features/recipes/create-recipe/create-recipe.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export const dynamic = "force-dynamic";

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
