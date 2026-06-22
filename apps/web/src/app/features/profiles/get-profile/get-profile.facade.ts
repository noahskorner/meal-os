import { findProfileById } from "./get-profile.repository";
import type { GetProfileRequest } from "./get-profile.request";
import {
  createProfileNotFoundResponse,
  createProfileResponse,
  createProfileValidationErrorResponse,
  type GetProfileNotFoundResponse,
  type GetProfileResponse,
  type GetProfileValidationErrorResponse,
} from "./get-profile.response";

type GetProfileResult =
  | {
      status: 200;
      body: GetProfileResponse;
    }
  | {
      status: 404;
      body: GetProfileNotFoundResponse;
    };

export async function getProfile(
  request: GetProfileRequest,
): Promise<GetProfileResult> {
  const profile = await findProfileById(request.id);

  if (!profile) {
    return {
      status: 404,
      body: createProfileNotFoundResponse(request.id),
    };
  }

  return {
    status: 200,
    body: createProfileResponse(profile),
  };
}

export function createGetProfileValidationError(
  issues: string[],
): GetProfileValidationErrorResponse {
  return createProfileValidationErrorResponse(issues);
}
