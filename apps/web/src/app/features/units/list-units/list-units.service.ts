import type { ListUnitsModel } from "./list-units.model";
import type { ListUnitsResponse } from "./list-units.response";

export class ListUnitsService {
  public createListResponse(units: ListUnitsModel[]): ListUnitsResponse {
    return units;
  }
}
