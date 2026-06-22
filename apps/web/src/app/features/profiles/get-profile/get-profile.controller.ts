import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { GetProfileRequest } from "./get-profile.request";
import {
  createProfileForbiddenResponse,
  createProfileNotFoundResponse,
  createProfileResponse,
  createProfileUnauthorizedResponse,
  createProfileValidationErrorResponse,
  type GetProfileForbiddenResponse,
  type GetProfileNotFoundResponse,
  type GetProfileResponse,
  type GetProfileUnauthorizedResponse,
  type GetProfileValidationErrorResponse,
} from "./get-profile.response";
import { GetProfileFacade } from "./get-profile.facade";

export type GetProfileResult =
  | {
      status: 200;
      body: GetProfileResponse;
    }
  | {
      status: 401;
      body: GetProfileUnauthorizedResponse;
    }
  | {
      status: 403;
      body: GetProfileForbiddenResponse;
    }
  | {
      status: 404;
      body: GetProfileNotFoundResponse;
    };

export class GetProfileController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly getProfileFacade: GetProfileFacade,
  ) {}

  public async get(request: GetProfileRequest): Promise<GetProfileResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createProfileUnauthorizedResponse(),
      };
    }

    if (currentUser.id !== request.id) {
      return {
        status: 403,
        body: createProfileForbiddenResponse(),
      };
    }

    const profile = await this.getProfileFacade.getById(request.id);

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
}

export function createGetProfileValidationError(
  issues: string[],
): GetProfileValidationErrorResponse {
  return createProfileValidationErrorResponse(issues);
}
