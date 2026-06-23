import type { GetProfileModel } from "./get-profile.model";
import type { GetProfileResponse } from "./get-profile.response";

export class GetProfileService {
  public createProfileResponse(profile: GetProfileModel): GetProfileResponse {
    return profile;
  }
}
