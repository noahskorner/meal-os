import type { PrismaClient } from "@repo/db";
import type { CreateRecipeModel } from "./create-recipe.model";

export class CreateRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(input: CreateRecipeModel): Promise<{ id: string }> {
    const recipe = await this.prisma.recipe.create({
      data: {
        createdById: input.createdById,
        name: input.name,
        description: input.description,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        servings: input.servings,
        recipeIngredients: {
          create: input.recipeIngredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unitId: ingredient.unitId,
            preparation: ingredient.preparation,
            note: ingredient.note,
            isOptional: ingredient.isOptional,
          })),
        },
        recipeSteps: {
          create: input.recipeSteps.map((step) => ({
            text: step.text,
            sortOrder: step.sortOrder,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return recipe;
  }
}
