import type { PrismaClient } from "@repo/db";
import type { GetUserIngredientModel } from "./get-user-ingredient.model";

export type UserIngredientVisibilitySubject = {
  currentUserId: string;
};

export class GetUserIngredientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findVisibleById(
    id: string,
    subject: UserIngredientVisibilitySubject,
  ): Promise<GetUserIngredientModel | null> {
    const userIngredient = await this.prisma.userIngredient.findFirst({
      where: {
        id,
        createdById: subject.currentUserId,
      },
      select: {
        id: true,
        name: true,
        categoryId: true,
        defaultUnitId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        defaultUnit: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            type: true,
          },
        },
      },
    });

    if (!userIngredient) {
      return null;
    }

    return {
      id: userIngredient.id,
      name: userIngredient.name,
      categoryId: userIngredient.categoryId,
      defaultUnitId: userIngredient.defaultUnitId,
      category: userIngredient.category,
      defaultUnit: userIngredient.defaultUnit
        ? {
            ...userIngredient.defaultUnit,
            type: userIngredient.defaultUnit.type,
          }
        : null,
    };
  }
}
