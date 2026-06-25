import type { GetUserIngredientModel } from "./get-user-ingredient.model";
import type { GetUserIngredientResponse } from "./get-user-ingredient.response";

export class GetUserIngredientService {
  public createUserIngredientResponse(
    userIngredient: GetUserIngredientModel,
  ): GetUserIngredientResponse {
    return userIngredient;
  }
}
