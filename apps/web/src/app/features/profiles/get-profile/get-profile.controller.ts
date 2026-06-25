import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { GetProfileRequest } from "./get-profile.request";
import {
  createProfileForbiddenResponseDto,
  createProfileNotFoundResponseDto,
  createProfileResponseDto,
  createProfileUnauthorizedResponseDto,
  createProfileValidationErrorResponseDto,
  type GetProfileForbiddenResponseDto,
  type GetProfileNotFoundResponseDto,
  type GetProfileResponseDto,
  type GetProfileUnauthorizedResponseDto,
  type GetProfileValidationErrorResponseDto,
} from "./get-profile.dto";
import { GetProfileFacade } from "./get-profile.facade";

export type GetProfileResult =
  | {
      status: 200;
      body: GetProfileResponseDto;
    }
  | {
      status: 401;
      body: GetProfileUnauthorizedResponseDto;
    }
  | {
      status: 403;
      body: GetProfileForbiddenResponseDto;
    }
  | {
      status: 404;
      body: GetProfileNotFoundResponseDto;
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
        body: createProfileUnauthorizedResponseDto(),
      };
    }

    if (currentUser.id !== request.profileId) {
      return {
        status: 403,
        body: createProfileForbiddenResponseDto(),
      };
    }

    const profile = await this.getProfileFacade.getById(request.profileId);

    if (!profile) {
      return {
        status: 404,
        body: createProfileNotFoundResponseDto(request.profileId),
      };
    }

    return {
      status: 200,
      body: createProfileResponseDto(profile),
    };
  }
}

export function createGetProfileValidationError(
  issues: string[],
): GetProfileValidationErrorResponseDto {
  return createProfileValidationErrorResponseDto(issues);
}
