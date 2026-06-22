import { PrismaClient } from "@repo/db";
import type { ListIngredientsModel } from "./list-ingredients.model";

export type FindManyIngredientsParams = {
  skip: number;
  take: number;
};

export class ListIngredientsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(
    params: FindManyIngredientsParams,
  ): Promise<ListIngredientsModel[]> {
    return this.prisma.ingredient.findMany({
      orderBy: {
        name: "asc",
      },
      skip: params.skip,
      take: params.take,
      select: {
        id: true,
        name: true,
        aliases: {
          orderBy: {
            alias: "asc",
          },
          select: {
            alias: true,
          },
        },
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
    }).then((ingredients) =>
      ingredients.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        aliases: ingredient.aliases.map(({ alias }) => alias),
        category: ingredient.category,
        defaultUnit: {
          ...ingredient.defaultUnit,
          type: ingredient.defaultUnit.type,
        },
      })),
    );
  }

  public async count(): Promise<number> {
    return this.prisma.ingredient.count();
  }
}
