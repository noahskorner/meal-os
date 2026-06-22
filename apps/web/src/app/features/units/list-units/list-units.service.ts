import type { ListUnitsModel } from "./list-units.model";
import { ListUnitsRepository } from "./list-units.repository";

export class ListUnitsService {
  constructor(private readonly listUnitsRepository: ListUnitsRepository) {}

  public async list(): Promise<ListUnitsModel[]> {
    return this.listUnitsRepository.findMany();
  }
}
