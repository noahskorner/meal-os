import { GetProfileModel } from "./get-profile.model";
import type { GetProfileResponse } from "./get-profile.response";

export function createProfile(profile: GetProfileModel): GetProfileResponse {
  return {
    id: profile.id,
  };
}
