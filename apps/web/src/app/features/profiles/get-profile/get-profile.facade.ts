import { GetProfileRepository } from "./get-profile.repository";
import type { GetProfileResponse } from "./get-profile.response";
import { GetProfileService } from "./get-profile.service";

export class GetProfileFacade {
  constructor(
    private readonly getProfileService: GetProfileService,
    private readonly getProfileRepository: GetProfileRepository,
  ) {}

  public async getById(id: string): Promise<GetProfileResponse | null> {
    const profile = await this.getProfileRepository.findById(id);

    if (!profile) {
      return null;
    }

    return this.getProfileService.createProfileResponse(profile);
  }
}
