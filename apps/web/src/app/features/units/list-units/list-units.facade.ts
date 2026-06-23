import { ListUnitsRepository } from "./list-units.repository";
import type { ListUnitsResponse } from "./list-units.response";
import { ListUnitsService } from "./list-units.service";

export class ListUnitsFacade {
  constructor(
    private readonly listUnitsService: ListUnitsService,
    private readonly listUnitsRepository: ListUnitsRepository,
  ) {}

  public async list(): Promise<ListUnitsResponse> {
    const units = await this.listUnitsRepository.findMany();

    return this.listUnitsService.createListResponse(units);
  }
}
