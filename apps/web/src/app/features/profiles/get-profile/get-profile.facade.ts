import type { GetProfileModel } from "./get-profile.model";
import { GetProfileService } from "./get-profile.service";

export class GetProfileFacade {
  constructor(private readonly getProfileService: GetProfileService) {}

  public async getById(id: string): Promise<GetProfileModel | null> {
    return this.getProfileService.getById(id);
  }
}
