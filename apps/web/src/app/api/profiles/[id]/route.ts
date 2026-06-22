import { NextRequest, NextResponse } from "next/server";
import {
  createGetProfileValidationError,
} from "@/app/features/profiles/get-profile/get-profile.facade";
import { getProfileRequestSchema } from "@/app/features/profiles/get-profile/get-profile.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

type GetProfileRouteContext = {
  params: Promise<{
    id: string;
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
  const getProfileFacade = await scope.resolve(SERVICE_TOKENS.getProfileFacade);
  const response = await getProfileFacade.get(parsedParams.data);

  return NextResponse.json(response.body, { status: response.status });
}
