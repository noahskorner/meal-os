import { GetUserIngredientRepository } from "./get-user-ingredient.repository";
import type { GetUserIngredientResponse } from "./get-user-ingredient.response";
import { GetUserIngredientService } from "./get-user-ingredient.service";

export type GetUserIngredientVisibility = {
  currentUserId: string;
};

export class GetUserIngredientFacade {
  constructor(
    private readonly getUserIngredientService: GetUserIngredientService,
    private readonly getUserIngredientRepository: GetUserIngredientRepository,
  ) {}

  public async getVisibleById(
    id: string,
    visibility: GetUserIngredientVisibility,
  ): Promise<GetUserIngredientResponse | null> {
    const userIngredient =
      await this.getUserIngredientRepository.findVisibleById(id, {
        currentUserId: visibility.currentUserId,
      });

    if (!userIngredient) {
      return null;
    }

    return this.getUserIngredientService.createUserIngredientResponse(
      userIngredient,
    );
  }
}
