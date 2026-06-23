import type { PrismaClient } from "@repo/db";
import type { ListRecipeModel } from "./list-recipes.model";

export class ListRecipesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findManyByCreatedById(
    createdById: string,
  ): Promise<ListRecipeModel[]> {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        createdById,
      },
      orderBy: {
        name: "asc",
      },
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
}
