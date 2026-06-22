import type { ListUnitsModel } from "./list-units.model";
import { ListUnitsService } from "./list-units.service";

export class ListUnitsFacade {
  constructor(private readonly listUnitsService: ListUnitsService) {}

  public async list(): Promise<ListUnitsModel[]> {
    return this.listUnitsService.list();
  }
}
