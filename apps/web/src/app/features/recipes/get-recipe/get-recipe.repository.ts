import type { PrismaClient } from "@repo/db";
import type { GetRecipeModel } from "./get-recipe.model";

export type RecipeVisibilitySubject = {
  currentUserId: string;
};

export class GetRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findVisibleById(
    id: string,
    subject: RecipeVisibilitySubject,
  ): Promise<GetRecipeModel | null> {
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        id,
        createdById: subject.currentUserId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        servings: true,
        recipeIngredients: {
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            ingredientId: true,
            userIngredientId: true,
            name: true,
            quantity: true,
            unitId: true,
            preparation: true,
            note: true,
            isOptional: true,
            ingredient: {
              select: {
                id: true,
                name: true,
              },
            },
            userIngredient: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        recipeSteps: {
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            text: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!recipe) {
      return null;
    }

    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servings: recipe.servings,
      ingredients: recipe.recipeIngredients.map((ingredient) => ({
        id: ingredient.id,
        ingredientId: ingredient.ingredientId,
        userIngredientId: ingredient.userIngredientId,
        name: ingredient.name,
        quantity:
          ingredient.quantity === null ? null : ingredient.quantity.toNumber(),
        unitId: ingredient.unitId,
        preparation: ingredient.preparation,
        note: ingredient.note,
        isOptional: ingredient.isOptional,
        ingredient: ingredient.ingredient,
        userIngredient: ingredient.userIngredient,
      })),
      steps: recipe.recipeSteps,
    };
  }
}
