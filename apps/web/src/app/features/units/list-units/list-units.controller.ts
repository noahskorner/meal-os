import {
  createListUnitsResponse,
  type ListUnitsResponse,
} from "./list-units.response";
import { ListUnitsFacade } from "./list-units.facade";

export type ListUnitsResult = {
  status: 200;
  body: ListUnitsResponse;
};

export class ListUnitsController {
  constructor(private readonly listUnitsFacade: ListUnitsFacade) {}

  public async get(): Promise<ListUnitsResult> {
    const units = await this.listUnitsFacade.list();

    return {
      status: 200,
      body: createListUnitsResponse(units),
    };
  }
}
