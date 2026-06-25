import { PrismaClient } from "@repo/db";
import type { ListIngredientCategoryModel } from "./list-ingredient-categories.model";

export class ListIngredientCategoriesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(): Promise<ListIngredientCategoryModel[]> {
    return this.prisma.ingredientCategory.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
