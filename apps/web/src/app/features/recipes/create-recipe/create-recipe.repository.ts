import type { PrismaClient } from "@repo/db";
import type {
  CreateRecipeInputModel,
  CreateRecipeModel,
} from "./create-recipe.model";

export class CreateRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(
    input: CreateRecipeInputModel,
  ): Promise<CreateRecipeModel> {
    const recipe = await this.prisma.recipe.create({
      data: {
        createdById: input.createdById,
        name: input.name,
        description: input.description,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        servings: input.servings,
      },
      select: {
        id: true,
      },
    });

    return recipe;
  }
}
