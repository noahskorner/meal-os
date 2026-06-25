import { NextRequest, NextResponse } from "next/server";
import { createGetRecipeValidationError } from "@/app/features/recipes/get-recipe/get-recipe.controller";
import { getRecipeRequestSchema } from "@/app/features/recipes/get-recipe/get-recipe.request";
import { createUpdateRecipeValidationError } from "@/app/features/recipes/update-recipe/update-recipe.controller";
import {
  updateRecipeBodyRequestSchema,
  updateRecipeParamsRequestSchema,
} from "@/app/features/recipes/update-recipe/update-recipe.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

type GetRecipeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: GetRecipeRouteContext,
) {
  const routeParams = await params;
  const parsedParams = getRecipeRequestSchema.safeParse(routeParams);

  if (!parsedParams.success) {
    return NextResponse.json(
      createGetRecipeValidationError(
        parsedParams.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "params";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const getRecipeController = await scope.resolve(
    SERVICE_TOKENS.getRecipeController,
  );
  const response = await getRecipeController.get(parsedParams.data);

  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(
  request: NextRequest,
  { params }: GetRecipeRouteContext,
) {
  const routeParams = await params;
  const parsedParams = updateRecipeParamsRequestSchema.safeParse(routeParams);

  if (!parsedParams.success) {
    return NextResponse.json(
      createUpdateRecipeValidationError(
        parsedParams.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "params";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsedBody = updateRecipeBodyRequestSchema.safeParse(json);

  if (!parsedBody.success) {
    return NextResponse.json(
      createUpdateRecipeValidationError(
        parsedBody.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "body";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const updateRecipeController = await scope.resolve(
    SERVICE_TOKENS.updateRecipeController,
  );
  const response = await updateRecipeController.put({
    ...parsedParams.data,
    body: parsedBody.data,
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: response.status });
  }

  return NextResponse.json(response.body, { status: response.status });
}
