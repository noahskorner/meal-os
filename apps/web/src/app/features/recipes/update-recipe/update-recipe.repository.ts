import type { PrismaClient } from "@repo/db";
import type { UpdateRecipeModel } from "./update-recipe.model";
import type { UpdateRecipeResponse } from "./update-recipe.response";

export type UpdateRecipeSubject = {
  currentUserId: string;
};

export class UpdateRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async updateOwnedById(
    input: UpdateRecipeModel,
    subject: UpdateRecipeSubject,
  ): Promise<UpdateRecipeResponse | null> {
    return this.prisma.$transaction(async (transaction) => {
      const existingRecipe = await transaction.recipe.findFirst({
        where: {
          id: input.id,
          createdById: subject.currentUserId,
        },
        select: {
          id: true,
        },
      });

      if (!existingRecipe) {
        return null;
      }

      const recipe = await transaction.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          prepTimeMinutes: input.prepTimeMinutes,
          cookTimeMinutes: input.cookTimeMinutes,
          servings: input.servings,
          recipeIngredients: {
            deleteMany: {},
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
            deleteMany: {},
            create: input.recipeSteps.map((step) => ({
              ingredientId: step.ingredientId,
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
    });
  }
}
