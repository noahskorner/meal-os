import { NextRequest, NextResponse } from "next/server";
import {
  createGetProfileValidationError,
  getProfile,
} from "@/app/features/profiles/get-profile/get-profile.facade";
import { getProfileRequestSchema } from "@/app/features/profiles/get-profile/get-profile.request";

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

  const response = await getProfile(parsedParams.data);

  return NextResponse.json(response.body, { status: response.status });
}
