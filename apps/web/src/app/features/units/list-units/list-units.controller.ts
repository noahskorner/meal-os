import {
  createListUnitsResponseDto,
  type ListUnitsResponseDto,
} from "./list-units.dto";
import { ListUnitsFacade } from "./list-units.facade";

export type ListUnitsResult = {
  status: 200;
  body: ListUnitsResponseDto;
};

export class ListUnitsController {
  constructor(private readonly listUnitsFacade: ListUnitsFacade) {}

  public async get(): Promise<ListUnitsResult> {
    const units = await this.listUnitsFacade.list();

    return {
      status: 200,
      body: createListUnitsResponseDto(units),
    };
  }
}
