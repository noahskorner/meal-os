import { CreateUserIngredientRepository } from "./create-user-ingredient.repository";
import type { CreateUserIngredientRequest } from "./create-user-ingredient.request";
import type { CreateUserIngredientResponse } from "./create-user-ingredient.response";
import { CreateUserIngredientService } from "./create-user-ingredient.service";

export class CreateUserIngredientFacade {
  constructor(
    private readonly createUserIngredientService: CreateUserIngredientService,
    private readonly createUserIngredientRepository: CreateUserIngredientRepository,
  ) {}

  public async create(
    request: CreateUserIngredientRequest & { createdById: string },
  ): Promise<CreateUserIngredientResponse> {
    const userIngredient =
      this.createUserIngredientService.createUserIngredient(request);

    return this.createUserIngredientRepository.create(userIngredient);
  }
}
