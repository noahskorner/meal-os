import type { GetProfileModel } from "./get-profile.model";
import { GetProfileRepository } from "./get-profile.repository";

export class GetProfileService {
  constructor(private readonly getProfileRepository: GetProfileRepository) {}

  public async getById(id: string): Promise<GetProfileModel | null> {
    return this.getProfileRepository.findById(id);
  }
}
