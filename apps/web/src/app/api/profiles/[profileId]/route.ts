import { NextRequest, NextResponse } from "next/server";
import {
  createGetProfileValidationError,
} from "@/app/features/profiles/get-profile/get-profile.controller";
import { getProfileRequestSchema } from "@/app/features/profiles/get-profile/get-profile.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

type GetProfileRouteContext = {
  params: Promise<{
    profileId: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: GetProfileRouteContext,
) {
  const routeParams = await params;
  const parsedParams = getProfileRequestSchema.safeParse(routeParams);

  if (!parsedParams.success) {
    return NextResponse.json(
      createGetProfileValidationError(
        parsedParams.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "params";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const getProfileController = await scope.resolve(
    SERVICE_TOKENS.getProfileController,
  );
  const response = await getProfileController.get(parsedParams.data);

  return NextResponse.json(response.body, { status: response.status });
}
