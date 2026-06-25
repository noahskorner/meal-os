import type { CreateUserIngredientModel } from "./create-user-ingredient.model";
import type { CreateUserIngredientRequest } from "./create-user-ingredient.request";

export class CreateUserIngredientService {
  public createUserIngredient(
    request: CreateUserIngredientRequest & { createdById: string },
  ): CreateUserIngredientModel {
    return {
      createdById: request.createdById,
      name: request.name,
      categoryId: request.categoryId ?? null,
      defaultUnitId: request.defaultUnitId ?? null,
    };
  }
}
