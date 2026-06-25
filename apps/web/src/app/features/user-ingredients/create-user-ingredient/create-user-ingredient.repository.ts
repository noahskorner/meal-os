import type { PrismaClient } from "@repo/db";
import type { CreateUserIngredientModel } from "./create-user-ingredient.model";
import type { CreateUserIngredientResponse } from "./create-user-ingredient.response";

export class CreateUserIngredientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(
    input: CreateUserIngredientModel,
  ): Promise<CreateUserIngredientResponse> {
    return this.prisma.userIngredient.create({
      data: {
        createdById: input.createdById,
        name: input.name,
        categoryId: input.categoryId,
        defaultUnitId: input.defaultUnitId,
      },
      select: {
        id: true,
      },
    });
  }
}
