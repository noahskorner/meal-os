import type { PrismaClient } from "@repo/db";
import type { ListRecipeModel } from "./list-recipes.model";

export type FindManyRecipesParams = {
  createdById: string;
  skip: number;
  take: number;
};

export class ListRecipesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(
    params: FindManyRecipesParams,
  ): Promise<ListRecipeModel[]> {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        createdById: params.createdById,
      },
      orderBy: {
        name: "asc",
      },
      skip: params.skip,
      take: params.take,
      select: {
        id: true,
        name: true,
        description: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        servings: true,
      },
    });

    return recipes.map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description ?? undefined,
      prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
      cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
      servings: recipe.servings ?? undefined,
    }));
  }

  public async countByCreatedById(createdById: string): Promise<number> {
    return this.prisma.recipe.count({
      where: {
        createdById,
      },
    });
  }
}
