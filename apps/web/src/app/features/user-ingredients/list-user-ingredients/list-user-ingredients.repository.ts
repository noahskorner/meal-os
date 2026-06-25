import { PrismaClient } from "@repo/db";
import type { ListUserIngredientModel } from "./list-user-ingredients.model";

export type FindManyUserIngredientsParams = {
  createdById: string;
  searchTerm?: string;
  skip: number;
  take: number;
};

type UserIngredientIdRow = {
  id: string;
};

type UserIngredientCountRow = {
  count: bigint;
};

export class ListUserIngredientsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findMany(
    params: FindManyUserIngredientsParams,
  ): Promise<ListUserIngredientModel[]> {
    const ids = params.searchTerm
      ? await this.findMatchingIds({
          ...params,
          searchTerm: params.searchTerm,
        })
      : (
          await this.prisma.userIngredient.findMany({
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
            },
          })
        ).map(({ id }) => id);

    if (ids.length === 0) {
      return [];
    }

    const userIngredients = await this.prisma.userIngredient.findMany({
      where: {
        id: {
          in: ids,
        },
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
    const userIngredientsById = new Map(
      userIngredients.map((userIngredient) => [
        userIngredient.id,
        {
          id: userIngredient.id,
          name: userIngredient.name,
          category: userIngredient.category,
          defaultUnit: userIngredient.defaultUnit
            ? {
                ...userIngredient.defaultUnit,
                type: userIngredient.defaultUnit.type,
              }
            : null,
        },
      ]),
    );

    return ids.map((id) => userIngredientsById.get(id)!);
  }

  public async count(params: {
    createdById: string;
    searchTerm?: string;
  }): Promise<number> {
    if (!params.searchTerm) {
      return this.prisma.userIngredient.count({
        where: {
          createdById: params.createdById,
        },
      });
    }

    const containsPattern = this.createContainsPattern(params.searchTerm);
    const [result] = await this.prisma.$queryRaw<UserIngredientCountRow[]>`
      SELECT COUNT(*) AS "count"
      FROM "user_ingredients" ui
      WHERE
        ui."created_by_id" = ${params.createdById}
        AND (
          ui."name" ILIKE ${containsPattern} ESCAPE '\\'
          OR ui."name" % ${params.searchTerm}
          OR ${params.searchTerm} <% ui."name"
          OR similarity(ui."name", ${params.searchTerm}) >= 0.2
          OR word_similarity(${params.searchTerm}, ui."name") >= 0.3
        )
    `;

    return Number(result?.count ?? 0);
  }

  private async findMatchingIds(
    params: FindManyUserIngredientsParams & { searchTerm: string },
  ): Promise<string[]> {
    const containsPattern = this.createContainsPattern(params.searchTerm);
    const rows = await this.prisma.$queryRaw<UserIngredientIdRow[]>`
      SELECT ui."id"
      FROM "user_ingredients" ui
      WHERE
        ui."created_by_id" = ${params.createdById}
        AND (
          ui."name" ILIKE ${containsPattern} ESCAPE '\\'
          OR ui."name" % ${params.searchTerm}
          OR ${params.searchTerm} <% ui."name"
          OR similarity(ui."name", ${params.searchTerm}) >= 0.2
          OR word_similarity(${params.searchTerm}, ui."name") >= 0.3
        )
      ORDER BY
        CASE
          WHEN LOWER(ui."name") = LOWER(${params.searchTerm}) THEN 3
          WHEN ui."name" ILIKE ${containsPattern} ESCAPE '\\' THEN 2
          ELSE 0
        END DESC,
        GREATEST(
          similarity(ui."name", ${params.searchTerm}),
          word_similarity(${params.searchTerm}, ui."name")
        ) DESC,
        ui."name" ASC
      LIMIT ${params.take}
      OFFSET ${params.skip}
    `;

    return rows.map(({ id }) => id);
  }

  private createContainsPattern(searchTerm: string): string {
    const escapedSearchTerm = searchTerm.replace(/[\\%_]/g, "\\$&");

    return `%${escapedSearchTerm}%`;
  }
}
