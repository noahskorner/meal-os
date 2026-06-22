import type { PrismaClient } from "@repo/db";
import type { CreateRecipeRequest } from "./create-recipe.request";

export class CreateRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(
    request: CreateRecipeRequest & { createdById: string },
  ): Promise<{ id: string }> {
    const recipe = await this.prisma.recipe.create({
      data: {
        createdById: request.createdById,
        name: request.name,
        description: request.description ?? null,
        prepTimeMinutes: request.prepTimeMinutes ?? null,
        cookTimeMinutes: request.cookTimeMinutes ?? null,
        servings: request.servings ?? null,
      },
      select: {
        id: true,
      },
    });

    return recipe;
  }
}
