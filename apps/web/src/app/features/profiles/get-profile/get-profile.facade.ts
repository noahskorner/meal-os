import type { GetProfileRequest } from "./get-profile.request";
import {
  createProfileNotFoundResponse,
  createProfileResponse,
  createProfileValidationErrorResponse,
  type GetProfileNotFoundResponse,
  type GetProfileResponse,
  type GetProfileValidationErrorResponse,
} from "./get-profile.response";
import { GetProfileService } from "./get-profile.service";

export type GetProfileResult =
  | {
      status: 200;
      body: GetProfileResponse;
    }
  | {
      status: 404;
      body: GetProfileNotFoundResponse;
    };

export class GetProfileFacade {
  constructor(private readonly getProfileService: GetProfileService) {}

  public async get(request: GetProfileRequest): Promise<GetProfileResult> {
    const profile = await this.getProfileService.getById(request.id);

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
